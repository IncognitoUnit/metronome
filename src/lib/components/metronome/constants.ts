// Constraints
const MIN_BPM = 20;
const MAX_BPM = 240;
const STARTING_BEAT = -1;
const MIN_BEATS = 1;
const MAX_BEATS = 12;
const VALID_BEAT_UNITS = [4, 8, 16];

// Keyboard codes
const PLAY_CODE = new Set(['Space']);
const BPM_INCREASE_CODE = new Set(['Equal', 'ArrowRight', 'ArrowUp']);
const BPM_DECREASE_CODE = new Set(['Minus', 'ArrowLeft', 'ArrowDown']);

export {
	MIN_BPM,
	MAX_BPM,
	STARTING_BEAT,
	MIN_BEATS,
	MAX_BEATS,
	VALID_BEAT_UNITS,
	PLAY_CODE,
	BPM_INCREASE_CODE,
	BPM_DECREASE_CODE,
};
