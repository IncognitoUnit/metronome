<script lang="ts">
	import { onMount } from 'svelte';
	import { Button } from './ui/button';
	import { Slider } from './ui/slider';
	import { Minus, Pause, Play, Plus } from '@lucide/svelte';

	// Constraints
	const MIN_BPM = 20;
	const MAX_BPM = 240;

	// Metronome state
	let bpm = $state(MAX_BPM / 2);
	let isPlaying = $state(false);

	// Audio context
	let audioContext: AudioContext | null = $state(null);
	let clickSchedulerTimerId: ReturnType<typeof setInterval> | null = null;

	function changeBpm(change: number) {
		bpm = Math.max(Math.min(bpm + change, MAX_BPM), MIN_BPM);
	}

	function togglePlay() {
		isPlaying = !isPlaying;
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
				// Create and play a quick beep sound
				const oscillator = audioContext!.createOscillator();
				const gainNode = audioContext!.createGain();

				oscillator.connect(gainNode);
				gainNode.connect(audioContext!.destination);

				oscillator.frequency.value = 1000;
				gainNode.gain.value = 1;

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
	class="mx-auto flex w-full flex-col items-center gap-6 rounded-lg bg-white px-4 py-4 shadow-md"
>
	<div class="font-mono text-5xl">{bpm} BPM</div>

	<div class="w-full px-4">
		<Slider
			min={MIN_BPM}
			max={MAX_BPM}
			value={bpm}
			type="single"
			onValueChange={(newBpm) => {
				bpm = newBpm;
			}}
		/>
		<div class="-mx-2 mt-2.5 flex justify-between text-xs text-gray-500">
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
			variant={isPlaying ? 'destructive' : 'default'}
			size="icon"
			aria-label={isPlaying ? 'Pause' : 'Play'}
		>
			{#if isPlaying}
				<Pause />
			{:else}
				<Play />
			{/if}
		</Button>
		<Button onclick={() => changeBpm(1)} size="icon" aria-label="Increase BPM">
			<Plus />
		</Button>
	</div>
</div>
