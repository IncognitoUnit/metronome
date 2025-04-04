<script lang="ts">
	import {
		ArrowDown,
		ArrowLeft,
		ArrowRight,
		ArrowUp,
		ChevronsDown,
		ChevronsUp,
		Gauge,
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
		MIN_BPM,
		PLAY_CODE,
		RHYTHM_PATTERNS,
		VOLUME_DECREASE_CODE,
		VOLUME_INCREASE_CODE,
	} from './constants';
	import {
		changeBpm,
		changeVolume,
		metronomeState as state,
		toggleBpmOverdrive,
		togglePlay,
	} from './state.svelte';
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
			const pattern = RHYTHM_PATTERNS[state.currentPattern];
			// Convert BPM to milliseconds between beats
			const intervalMs = 60000 / state.bpm;

			let pulseIndex = 0;

			clickSchedulerTimerId = setInterval(() => {
				const isMainPulse = pulseIndex % pattern.length === 0;
				const triggerBeat = isMainPulse && state.accentedBeats.has(state.currentBeat);

				const oscillator = state.audioContext!.createOscillator();
				const gainNode = state.audioContext!.createGain();

				oscillator.connect(gainNode);
				gainNode.connect(state.audioContext!.destination);

				// Adjust sound properties
				const volumeGain = state.volumePercent / 100;
				let baseGain = 1;
				if (isMainPulse && triggerBeat) {
					oscillator.frequency.value = 1500;
					baseGain = 1.1;
				} else {
					oscillator.frequency.value = 1000;
					baseGain = 1;
				}
				gainNode.gain.value = baseGain * volumeGain;

				// Quick fade out
				gainNode.gain.exponentialRampToValueAtTime(0.001, state.audioContext!.currentTime + 0.1);

				oscillator.start();
				oscillator.stop(state.audioContext!.currentTime + 0.1);

				pulseIndex++;
				state.showPulse = true;
				setTimeout(() => {
					if (pulseIndex % pattern.length === 0) {
						state.currentBeat = (state.currentBeat + 1) % state.beatsPerMeasure;
					}
					state.showPulse = false;
				}, 100);
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
		<Beats />
	</div>

	<div class="flex flex-col items-center gap-2">
		<Button
			class="flex h-40 w-40 flex-col items-center rounded-full select-none"
			variant={state.isPlaying ? 'default' : 'outline'}
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
			<VolumeControls />
			<Button variant="outline" onclick={() => changeBpm(-1)} size="icon" aria-label="Decrease BPM">
				<ChevronsDown />
			</Button>
			<div class="flex flex-1 flex-col gap-3">
				<Slider
					min={MIN_BPM}
					max={state.maxBpm}
					value={state.bpm}
					type="single"
					step={state.bpmStep}
					onValueChange={(value) => {
						state.bpm = value;
					}}
				/>
			</div>
			<Button variant="outline" onclick={() => changeBpm(1)} size="icon" aria-label="Increase BPM">
				<ChevronsUp />
			</Button>
			<Button
				variant={state.bpmOverdrive ? 'destructive' : 'outline'}
				size="icon"
				aria-label="Toggle BPM Overdrive"
				onclick={toggleBpmOverdrive}
			>
				<Gauge />
			</Button>
		</div>
	</div>
</div>
