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
export const STARTING_BEAT = -1;
export const VALID_BEAT_UNITS = [4, 8, 16];

// Volume
export const MIN_VOLUME_PERCENT = 0;
export const MAX_VOLUME_PERCENT = 100;
export const VOLUME_INCREASE_CODE = new Set(['Equal']);
export const VOLUME_DECREASE_CODE = new Set(['Minus']);
