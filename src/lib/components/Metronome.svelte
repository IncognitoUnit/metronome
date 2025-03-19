<script lang="ts">
	import { onMount } from 'svelte';

	// Metronome state
	let bpm = $state(120);
	let isPlaying = $state(false);

	// Constraints
	const MIN_BPM = 20;
	const MAX_BPM = 220;

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

<div class="mx-auto flex w-full flex-col items-center rounded-lg bg-white shadow-md">
	<div class="mb-6 font-mono text-5xl">{bpm} BPM</div>

	<div class="mb-6 w-full">
		<input
			type="range"
			min={MIN_BPM}
			max={MAX_BPM}
			bind:value={bpm}
			class="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200"
		/>
		<div class="mt-1 flex justify-between text-xs text-gray-500">
			<span>{MIN_BPM}</span>
			<span>{MAX_BPM}</span>
		</div>
	</div>

	<div class="mb-6 flex items-center gap-4">
		<button
			onclick={() => changeBpm(-1)}
			class="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 text-2xl font-bold hover:bg-gray-300"
			aria-label="Decrease BPM"
		>
			-
		</button>
		<button
			onclick={togglePlay}
			class="flex h-16 w-16 items-center justify-center rounded-full text-white {isPlaying
				? 'bg-red-500 hover:bg-red-600'
				: 'bg-green-500 hover:bg-green-600'}"
			aria-label={isPlaying ? 'Pause' : 'Play'}
		>
			{#if isPlaying}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-8 w-8"
					viewBox="0 0 20 20"
					fill="currentColor"
				>
					<path
						fill-rule="evenodd"
						d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
						clip-rule="evenodd"
					/>
				</svg>
			{:else}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-8 w-8"
					viewBox="0 0 20 20"
					fill="currentColor"
				>
					<path
						fill-rule="evenodd"
						d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
						clip-rule="evenodd"
					/>
				</svg>
			{/if}
		</button>
		<button
			onclick={() => changeBpm(1)}
			class="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 text-2xl font-bold hover:bg-gray-300"
			aria-label="Increase BPM"
		>
			+
		</button>
	</div>
</div>
