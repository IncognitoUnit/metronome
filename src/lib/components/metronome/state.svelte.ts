import { MAX_BPM, MIN_BPM, REAL_MAX_BPM, STARTING_BEAT } from './constants';

interface MetronomeState {
	volumePercent: number;
	isPlaying: boolean;

	bpm: number;
	maxBpm: number;
	bpmStep: number;
	bpmOverdrive: boolean;
	beatsPerMeasure: number;
	beatUnit: number;
	currentBeat: number;
	accentedBeats: Set<number>;
	audioContext: AudioContext | null;
}

export const metronomeState = $state<MetronomeState>({
	volumePercent: 50,
	bpm: MAX_BPM / 2,
	maxBpm: MAX_BPM,
	bpmStep: 1,
	bpmOverdrive: false,
	beatsPerMeasure: 4,
	beatUnit: 4,
	currentBeat: STARTING_BEAT,
	accentedBeats: new Set<number>([0]),
	isPlaying: false,
	audioContext: null,
});

export function togglePlay() {
	metronomeState.isPlaying = !metronomeState.isPlaying;
	if (metronomeState.isPlaying) {
		metronomeState.currentBeat = STARTING_BEAT;
	}
}

export function toggleBpmOverdrive() {
	metronomeState.bpmOverdrive = !metronomeState.bpmOverdrive;
	if (metronomeState.bpmOverdrive) {
		metronomeState.maxBpm = REAL_MAX_BPM;
		metronomeState.bpmStep = 10;
	} else {
		metronomeState.maxBpm = MAX_BPM;
		metronomeState.bpmStep = 1;
	}
}

export function changeBpm(change: number) {
	change = change * metronomeState.bpmStep;
	metronomeState.bpm = Math.max(
		Math.min(metronomeState.bpm + change, metronomeState.maxBpm),
		MIN_BPM,
	);
}

export function changeVolume(change: number) {
	metronomeState.volumePercent = Math.max(Math.min(metronomeState.volumePercent + change, 100), 0);
}
