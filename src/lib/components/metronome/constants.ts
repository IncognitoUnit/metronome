// Play
export const PLAY_CODE = new Set(['Space']);

// BPM
export const MIN_BPM = 20;
export const MAX_BPM = 240;
export const REAL_MAX_BPM = 3000;
export const BPM_INCREASE_CODE = new Set(['ArrowRight', 'ArrowUp']);
export const BPM_DECREASE_CODE = new Set(['ArrowLeft', 'ArrowDown']);

// Beats
export const MIN_BEATS = 1;
export const MAX_BEATS = 12;
export const STARTING_BEAT = 0;

// Rhythm
export enum Rhythm {
	Normal = 'Normal',
	Eights = 'Eights',
	Triplets = 'Triplets',
}
export const RHYTHM_PATTERNS: Record<Rhythm, number[]> = {
	[Rhythm.Normal]: [1],
	[Rhythm.Eights]: [1, 1],
	[Rhythm.Triplets]: [1, 1, 1],
};

// Volume
export const MIN_VOLUME_PERCENT = 0;
export const MAX_VOLUME_PERCENT = 100;
export const VOLUME_INCREASE_CODE = new Set(['Equal']);
export const VOLUME_DECREASE_CODE = new Set(['Minus']);
