<script lang="ts">
	import {
		ArrowDown,
		ArrowLeft,
		ArrowRight,
		ArrowUp,
		ChevronsDown,
		ChevronsUp,
		Space,
	} from '@lucide/svelte';
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
		VOLUME_DECREASE_CODE,
		VOLUME_INCREASE_CODE,
	} from './constants';
	import { SignatureDialog } from './signature-dialog';
	import { changeBpm, changeVolume, metronomeState as state, togglePlay } from './state.svelte';
	import { VolumeControls } from './volume-controls';

	let clickSchedulerTimerId: ReturnType<typeof setInterval> | null = null;

	function handleKeyup(event: KeyboardEvent) {
		const activeElement = document.activeElement;
		const tagName = activeElement?.tagName.toLowerCase();

		if (activeElement && tagName !== 'body') {
			return;
		}

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
		if (VOLUME_DECREASE_CODE.has(event.code)) {
			event.preventDefault();
			changeVolume(-1);
		}
		if (VOLUME_INCREASE_CODE.has(event.code)) {
			event.preventDefault();
			changeVolume(1);
		}
	}

	function scheduleClicks() {
		if (!state.audioContext || state.audioContext.state === 'closed') {
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

				// Apply volume from state
				const volumeGain = state.volumePercent / 100;
				const baseGain = triggerSound ? 1.2 : 1;
				gainNode.gain.value = baseGain * volumeGain;

				// Quick fade out
				gainNode.gain.exponentialRampToValueAtTime(0.001, state.audioContext!.currentTime + 0.1);

				oscillator.start();
				oscillator.stop(state.audioContext!.currentTime + 0.1);
			}, intervalMs);
		}
	}

	$effect(() => {
		if (state.isPlaying) {
			scheduleClicks();
		} else {
			if (clickSchedulerTimerId) {
				clearInterval(clickSchedulerTimerId);
				clickSchedulerTimerId = null;
			}
		}
	});

	onMount(() => {
		window.addEventListener('keyup', handleKeyup);

		return () => {
			if (clickSchedulerTimerId) {
				clearInterval(clickSchedulerTimerId);
			}
			if (state.audioContext) {
				state.audioContext.close();
			}
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
			<VolumeControls />
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
		<KeyboardHint class="hidden px-3 md:block"><Space /></KeyboardHint>
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
				<ChevronsDown />
			</Button>
			<div class="flex flex-1 flex-col gap-3">
				<Slider
					min={MIN_BPM}
					max={MAX_BPM}
					value={state.bpm}
					type="single"
					onValueChange={(value) => {
						state.bpm = value;
					}}
				/>
			</div>
			<Button variant="outline" onclick={() => changeBpm(1)} size="icon" aria-label="Increase BPM">
				<ChevronsUp />
			</Button>
		</div>
	</div>
</div>
