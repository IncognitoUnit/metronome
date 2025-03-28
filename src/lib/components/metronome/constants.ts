// Play
const PLAY_CODE = new Set(['Space']);

// BPM
const MIN_BPM = 20;
const MAX_BPM = 240;
const BPM_INCREASE_CODE = new Set(['ArrowRight', 'ArrowUp']);
const BPM_DECREASE_CODE = new Set(['ArrowLeft', 'ArrowDown']);

// Beats
const MIN_BEATS = 1;
const MAX_BEATS = 12;
const STARTING_BEAT = -1;
const VALID_BEAT_UNITS = [4, 8, 16];

// Volume
const MIN_VOLUME_PERCENT = 0;
const MAX_VOLUME_PERCENT = 100;
const VOLUME_INCREASE_CODE = new Set(['Equal']);
const VOLUME_DECREASE_CODE = new Set(['Minus']);

export {
	PLAY_CODE,
	MIN_BPM,
	MAX_BPM,
	BPM_INCREASE_CODE,
	BPM_DECREASE_CODE,
	MIN_BEATS,
	MAX_BEATS,
	STARTING_BEAT,
	VALID_BEAT_UNITS,
	VOLUME_INCREASE_CODE,
	VOLUME_DECREASE_CODE,
	MIN_VOLUME_PERCENT,
	MAX_VOLUME_PERCENT,
};
