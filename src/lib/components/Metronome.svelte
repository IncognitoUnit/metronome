<script lang="ts">
	import { Minus, Plus } from '@lucide/svelte';
	import { onMount } from 'svelte';

	import SignatureDialog from './SignatureDialog.svelte';
	import { Button } from './ui/button';
	import { Slider } from './ui/slider';

	// Constraints
	const MIN_BPM = 20;
	const MAX_BPM = 240;
	const STARTING_BEAT = -1;

	// Keyboard codes
	const PLAY_CODE = ['Space'];
	const BPM_INCREASE_CODE = ['Equal', 'ArrowRight', 'ArrowUp'];
	const BPM_DECREASE_CODE = ['Minus', 'ArrowLeft', 'ArrowDown'];

	// Metronome state
	let bpm = $state(MAX_BPM / 2);
	let isPlaying = $state(false);
	let beatsPerMeasure = $state(4);
	let beatUnit = $state(4);
	let currentBeat = $state(STARTING_BEAT);

	// Create an array for beat indicators
	let beatIndicators = $derived(Array.from({ length: beatsPerMeasure }, (_, index) => index));

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
		console.log(activeElement);
		const tagName = activeElement?.tagName.toLowerCase();

		// Skip if the active element is an input, button, textarea, select or has role="button"
		if (activeElement && tagName !== 'body') {
			return;
		}

		// Process keyboard shortcuts
		if (PLAY_CODE.includes(event.code)) {
			event.preventDefault();
			togglePlay();
		}
		if (BPM_DECREASE_CODE.includes(event.code)) {
			event.preventDefault();
			changeBpm(-1);
		}
		if (BPM_INCREASE_CODE.includes(event.code)) {
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

				// Create and play a sound, first beat has higher pitch
				const isFirstBeat = currentBeat === 0;
				const oscillator = audioContext!.createOscillator();
				const gainNode = audioContext!.createGain();

				oscillator.connect(gainNode);
				gainNode.connect(audioContext!.destination);

				// Higher frequency for the first beat
				oscillator.frequency.value = isFirstBeat ? 1500 : 1000;
				gainNode.gain.value = isFirstBeat ? 1.2 : 1;

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
	class="bg-background mx-auto flex w-full flex-1 flex-col items-center justify-between gap-6 rounded-lg p-4"
>
	<div class="flex flex-col items-center gap-4">
		<div class="flex items-center gap-2">
			<SignatureDialog bind:beatsPerMeasure bind:beatUnit />

			<div class="text-muted-foreground font-mono text-sm">
				{beatsPerMeasure}/{beatUnit}
			</div>
		</div>
		<div class="flex w-full justify-center gap-4 pt-2">
			{#each beatIndicators as idx (idx)}
				<div
					class="data-[active=true]:bg-primary bg-muted size-6 rounded-full transition-all"
					data-active={currentBeat === idx && isPlaying}
				></div>
			{/each}
		</div>
	</div>

	<Button
		class="flex h-40 w-40 flex-col items-center rounded-full"
		variant={isPlaying ? 'outline' : 'default'}
		size="icon"
		onclick={togglePlay}
		aria-label={isPlaying ? 'Pause' : 'Play'}
	>
		<div class="mt-6 font-mono text-5xl">
			{bpm}
		</div>
		<span class="text-muted-foreground text-lg">BPM</span>
	</Button>

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
