<script lang="ts">
	import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Minus, Plus } from '@lucide/svelte';
	import { onMount } from 'svelte';

	import { KeyboardHint } from '$lib/components/keyboard-hint';
	import { Button } from '$lib/components/ui/button';
	import { Slider } from '$lib/components/ui/slider';

	import { Beats } from './beats';
	import {
		BPM_DECREASE_CODE,
		BPM_INCREASE_CODE,
		MAX_BPM,
		MIN_BPM,
		PLAY_CODE,
		STARTING_BEAT,
	} from './constants';
	import { SignatureDialog } from './signature-dialog';

	// Metronome state
	let bpm = $state(MAX_BPM / 2);
	let isPlaying = $state(false);
	let beatsPerMeasure = $state(4);
	let beatUnit = $state(4);
	let currentBeat = $state(STARTING_BEAT);
	// Beats that play accentuated sound
	let accentedBeats = $state(new Set<number>([0]));

	// Audio context
	let audioContext: AudioContext | null = $state(null);
	let clickSchedulerTimerId: ReturnType<typeof setInterval> | null = null;

	function changeBpm(change: number) {
		bpm = Math.max(Math.min(bpm + change, MAX_BPM), MIN_BPM);
	}

	function togglePlay() {
		isPlaying = !isPlaying;
		if (isPlaying) {
			currentBeat = STARTING_BEAT;
		}
	}

	function handleKeyup(event: KeyboardEvent) {
		// Only handle keys if no element is actively focused (like inputs, buttons, etc.)
		// This prevents interference with form controls and other interactive elements
		const activeElement = document.activeElement;
		const tagName = activeElement?.tagName.toLowerCase();

		// Skip if the active element is an input, button, textarea, select or has role="button"
		if (activeElement && tagName !== 'body') {
			return;
		}

		// Process keyboard shortcuts
		if (PLAY_CODE.has(event.code)) {
			event.preventDefault();
			togglePlay();
		}
		if (BPM_DECREASE_CODE.has(event.code)) {
			event.preventDefault();
			changeBpm(-1);
		}
		if (BPM_INCREASE_CODE.has(event.code)) {
			event.preventDefault();
			changeBpm(1);
		}
	}

	function scheduleClicks() {
		if (!audioContext) {
			audioContext = new AudioContext();
		}

		if (clickSchedulerTimerId) {
			clearInterval(clickSchedulerTimerId);
			clickSchedulerTimerId = null;
		}

		if (isPlaying) {
			// Convert BPM to milliseconds between beats
			const intervalMs = 60000 / bpm;

			clickSchedulerTimerId = setInterval(() => {
				// Increment beat and wrap around
				currentBeat = (currentBeat + 1) % beatsPerMeasure;

				// Create and play a sound, trigger beats have more pronounced sound
				const triggerSound = accentedBeats.has(currentBeat);
				const oscillator = audioContext!.createOscillator();
				const gainNode = audioContext!.createGain();

				oscillator.connect(gainNode);
				gainNode.connect(audioContext!.destination);

				// Higher frequency for the trigger beats
				oscillator.frequency.value = triggerSound ? 1500 : 1000;
				gainNode.gain.value = triggerSound ? 1.2 : 1;

				// Quick fade out
				gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext!.currentTime + 0.1);

				oscillator.start();
				oscillator.stop(audioContext!.currentTime + 0.1);
			}, intervalMs);
		}
	}

	// Reactive effect to manage scheduling
	$effect(() => {
		if (isPlaying) {
			scheduleClicks();
		} else {
			// Stop scheduled clicks when metronome is paused
			if (clickSchedulerTimerId) {
				clearInterval(clickSchedulerTimerId);
				clickSchedulerTimerId = null;
			}
		}
	});

	// Track time signature changes
	$effect(() => {
		// If time signature changes while playing, restart
		if (isPlaying) {
			// Reset current beat and reschedule
			currentBeat = STARTING_BEAT;
			scheduleClicks();
		}
	});

	onMount(() => {
		// Add keyboard event listener when component mounts
		window.addEventListener('keyup', handleKeyup);

		return () => {
			if (clickSchedulerTimerId) {
				clearInterval(clickSchedulerTimerId);
			}
			if (audioContext) {
				audioContext.close();
			}
			// Remove event listener when component unmounts
			window.removeEventListener('keyup', handleKeyup);
		};
	});
</script>

<div
	class="bg-background mx-auto flex w-full flex-1 flex-col items-center justify-between rounded-lg p-4"
>
	<div class="flex flex-col items-center gap-4">
		<div class="flex items-center gap-2">
			<SignatureDialog bind:beatsPerMeasure bind:beatUnit />
		</div>
		<Beats bind:accentedBeats {beatsPerMeasure} {currentBeat} {isPlaying} />
	</div>

	<div class="flex flex-col items-center gap-2">
		<Button
			class="flex h-40 w-40 flex-col items-center rounded-full"
			variant={isPlaying ? 'outline' : 'default'}
			size="icon"
			onclick={togglePlay}
			aria-label={isPlaying ? 'Pause' : 'Play'}
		>
			<div class="mt-8 font-mono text-5xl">
				{bpm}
			</div>
			<span class="text-muted-foreground text-lg">BPM</span>
		</Button>
		<KeyboardHint class="hidden px-2 md:block">space</KeyboardHint>
	</div>

	<div class="flex w-full flex-col items-center gap-4">
		<div class="hidden gap-2 md:flex">
			<KeyboardHint><ArrowLeft /></KeyboardHint>
			<KeyboardHint><ArrowDown /></KeyboardHint>
			<KeyboardHint><ArrowUp /></KeyboardHint>
			<KeyboardHint><ArrowRight /></KeyboardHint>
		</div>
		<div class="flex w-full items-center gap-4">
			<Button onclick={() => changeBpm(-1)} size="icon" aria-label="Decrease BPM">
				<Minus />
			</Button>
			<div class="flex flex-1 flex-col gap-3">
				<Slider
					min={MIN_BPM}
					max={MAX_BPM}
					value={bpm}
					type="single"
					onValueChange={(newBpm) => {
						bpm = newBpm;
					}}
				/>
			</div>
			<Button onclick={() => changeBpm(1)} size="icon" aria-label="Increase BPM">
				<Plus />
			</Button>
		</div>
	</div>
</div>
