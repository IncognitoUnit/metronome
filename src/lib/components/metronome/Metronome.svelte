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
	import { metronomeState as state } from './state.svelte';

	let clickSchedulerTimerId: ReturnType<typeof setInterval> | null = null;

	function changeBpm(change: number) {
		state.bpm = Math.max(Math.min(state.bpm + change, MAX_BPM), MIN_BPM);
	}

	function togglePlay() {
		state.isPlaying = !state.isPlaying;
		if (state.isPlaying) {
			state.currentBeat = STARTING_BEAT;
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
		if (!state.audioContext) {
			state.audioContext = new AudioContext();
		}

		if (clickSchedulerTimerId) {
			clearInterval(clickSchedulerTimerId);
			clickSchedulerTimerId = null;
		}

		if (state.isPlaying) {
			// Convert BPM to milliseconds between beats
			const intervalMs = 60000 / state.bpm;

			clickSchedulerTimerId = setInterval(() => {
				// Increment beat and wrap around
				state.currentBeat = (state.currentBeat + 1) % state.beatsPerMeasure;

				// Create and play a sound, trigger beats have more pronounced sound
				const triggerSound = state.accentedBeats.has(state.currentBeat);
				const oscillator = state.audioContext!.createOscillator();
				const gainNode = state.audioContext!.createGain();

				oscillator.connect(gainNode);
				gainNode.connect(state.audioContext!.destination);

				// Higher frequency for the trigger beats
				oscillator.frequency.value = triggerSound ? 1500 : 1000;
				gainNode.gain.value = triggerSound ? 1.2 : 1;

				// Quick fade out
				gainNode.gain.exponentialRampToValueAtTime(0.001, state.audioContext!.currentTime + 0.1);

				oscillator.start();
				oscillator.stop(state.audioContext!.currentTime + 0.1);
			}, intervalMs);
		}
	}

	// Reactive effect to manage scheduling
	$effect(() => {
		if (state.isPlaying) {
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
		if (state.isPlaying) {
			// Reset current beat and reschedule
			state.currentBeat = STARTING_BEAT;
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
			if (state.audioContext) {
				state.audioContext.close();
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
			<SignatureDialog />
		</div>
		<Beats />
	</div>

	<div class="flex flex-col items-center gap-2">
		<Button
			class="flex h-40 w-40 flex-col items-center rounded-full select-none"
			variant={state.isPlaying ? 'outline' : 'default'}
			size="icon"
			onclick={togglePlay}
			aria-label={state.isPlaying ? 'Pause' : 'Play'}
		>
			<div class="mt-8 font-mono text-5xl">
				{state.bpm}
			</div>
			<span class="text-muted-foreground text-lg">BPM</span>
		</Button>
		<KeyboardHint class="hidden px-2 md:block">space</KeyboardHint>
	</div>

	<div class="flex w-full flex-col items-center gap-4">
		<div class="hidden gap-2 md:flex">
			<KeyboardHint><ArrowLeft size={20} /></KeyboardHint>
			<KeyboardHint><ArrowDown size={20} /></KeyboardHint>
			<KeyboardHint><ArrowUp size={20} /></KeyboardHint>
			<KeyboardHint><ArrowRight size={20} /></KeyboardHint>
		</div>
		<div class="flex w-full items-center gap-4">
			<Button variant="outline" onclick={() => changeBpm(-1)} size="icon" aria-label="Decrease BPM">
				<Minus />
			</Button>
			<div class="flex flex-1 flex-col gap-3">
				<Slider
					min={MIN_BPM}
					max={MAX_BPM}
					value={state.bpm}
					type="single"
					onValueChange={(newBpm) => {
						state.bpm = newBpm;
					}}
				/>
			</div>
			<Button variant="outline" onclick={() => changeBpm(1)} size="icon" aria-label="Increase BPM">
				<Plus />
			</Button>
		</div>
	</div>
</div>
