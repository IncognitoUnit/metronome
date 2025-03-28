import { MAX_BPM, STARTING_BEAT } from './constants';

interface MetronomeState {
	bpm: number;
	isPlaying: boolean;
	beatsPerMeasure: number;
	beatUnit: number;
	currentBeat: number;
	accentedBeats: Set<number>;
	audioContext: AudioContext | null;
}

export const metronomeState = $state<MetronomeState>({
	bpm: MAX_BPM / 2,
	isPlaying: false,
	beatsPerMeasure: 4,
	beatUnit: 4,
	currentBeat: STARTING_BEAT,
	accentedBeats: new Set<number>([0]),
	audioContext: null,
});
