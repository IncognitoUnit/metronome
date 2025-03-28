import { MAX_BPM, MIN_BPM, STARTING_BEAT } from './constants';

interface MetronomeState {
	volumePercent: number;
	bpm: number;
	isPlaying: boolean;
	beatsPerMeasure: number;
	beatUnit: number;
	currentBeat: number;
	accentedBeats: Set<number>;
	audioContext: AudioContext | null;
}

export const metronomeState = $state<MetronomeState>({
	volumePercent: 50,
	bpm: MAX_BPM / 2,
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

export function changeBpm(change: number) {
	metronomeState.bpm = Math.max(Math.min(metronomeState.bpm + change, MAX_BPM), MIN_BPM);
}

export function changeVolume(change: number) {
	metronomeState.volumePercent = Math.max(Math.min(metronomeState.volumePercent + change, 100), 0);
}
