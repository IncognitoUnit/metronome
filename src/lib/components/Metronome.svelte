<script lang="ts">
	import { Minus, Pause, Play, Plus } from '@lucide/svelte';
	import { onMount } from 'svelte';

	import SignatureDialog from './SignatureDialog.svelte';
	import { Button } from './ui/button';
	import { Slider } from './ui/slider';

	// Constraints
	const MIN_BPM = 20;
	const MAX_BPM = 240;
	const STARTING_BEAT = -1;

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
		return () => {
			if (clickSchedulerTimerId) {
				clearInterval(clickSchedulerTimerId);
			}
			if (audioContext) {
				audioContext.close();
			}
		};
	});
</script>

<div
	class="bg-background mx-auto flex w-full flex-col items-center gap-6 rounded-lg px-4 py-4 shadow-md"
>
	<div class="font-mono text-5xl">{bpm} BPM</div>
	<div class="flex w-full flex-col gap-3 px-4">
		<Slider
			min={MIN_BPM}
			max={MAX_BPM}
			value={bpm}
			type="single"
			onValueChange={(newBpm) => {
				bpm = newBpm;
			}}
		/>
		<div class="text-muted-foreground -mx-2 flex justify-between text-xs">
			<span>{MIN_BPM}</span>
			<span>{MAX_BPM}</span>
		</div>
	</div>

	<div class="flex items-center gap-4">
		<Button onclick={() => changeBpm(-1)} size="icon" aria-label="Decrease BPM">
			<Minus />
		</Button>
		<Button
			onclick={togglePlay}
			variant={isPlaying ? 'outline' : 'default'}
			size="icon"
			aria-label={isPlaying ? 'Pause' : 'Play'}
		>
			<Play class="scale-100 transition-all data-[active=false]:scale-0" data-active={!isPlaying} />
			<Pause
				class="absolute scale-0 transition-all data-[active=true]:scale-100"
				data-active={isPlaying}
			/>
		</Button>
		<Button onclick={() => changeBpm(1)} size="icon" aria-label="Increase BPM">
			<Plus />
		</Button>
	</div>

	<div class="flex items-center gap-2">
		<SignatureDialog bind:beatsPerMeasure bind:beatUnit />
		<div class="text-muted-foreground font-mono text-sm">
			{beatsPerMeasure}/{beatUnit}
		</div>
	</div>

	<div class="flex w-full justify-center gap-2 pt-2">
		{#each beatIndicators as idx (idx)}
			<div
				class="data-[active=true]:bg-primary bg-muted size-3 rounded-full transition-all"
				data-active={currentBeat === idx && isPlaying}
			></div>
		{/each}
	</div>
</div>
