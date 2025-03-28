import {
	MAX_BEATS,
	MAX_BPM,
	MIN_BEATS,
	MIN_BPM,
	REAL_MAX_BPM,
	Rhythm,
	STARTING_BEAT,
} from './constants';

interface MetronomeState {
	isPlaying: boolean;
	volumePercent: number;

	bpm: number;
	maxBpm: number;
	bpmStep: number;
	bpmOverdrive: boolean;

	beatsPerMeasure: number;
	currentBeat: number;
	accentedBeats: Set<number>;

	currentPattern: Rhythm;
	showPulse: boolean;

	audioContext: AudioContext | null;
}

export const metronomeState = $state<MetronomeState>({
	isPlaying: false,
	volumePercent: 50,

	bpm: MAX_BPM / 2,
	maxBpm: MAX_BPM,
	bpmStep: 1,
	bpmOverdrive: false,

	beatsPerMeasure: 4,
	currentBeat: STARTING_BEAT,
	accentedBeats: new Set<number>([0]),

	currentPattern: Rhythm.Normal,
	showPulse: false,

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

export function changePulses(change: number) {
	metronomeState.beatsPerMeasure = Math.max(
		Math.min(metronomeState.beatsPerMeasure + change, MAX_BEATS),
		MIN_BEATS,
	);
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
