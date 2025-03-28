type Signature = {
	beatsPerMeasure: number;
	beatUnit: number;
};

export const COMMON_SIGNATURES: Signature[] = [
	{
		beatsPerMeasure: 2,
		beatUnit: 4,
	},
	{
		beatsPerMeasure: 3,
		beatUnit: 4,
	},
	{
		beatsPerMeasure: 4,
		beatUnit: 4,
	},
	{
		beatsPerMeasure: 5,
		beatUnit: 4,
	},
	{
		beatsPerMeasure: 6,
		beatUnit: 8,
	},
];

export { default as SignatureDialog } from './SignatureDialog.svelte';
