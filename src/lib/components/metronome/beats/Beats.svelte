<script lang="ts">
	let {
		beatsPerMeasure,
		currentBeat,
		isPlaying,
		accentedBeats = $bindable(),
	}: {
		beatsPerMeasure: number;
		currentBeat: number;
		isPlaying: boolean;
		accentedBeats: Set<number>;
	} = $props();

	let beatIndicators = $derived(Array.from({ length: beatsPerMeasure }, (_, index) => index));
</script>

<div class="flex w-full justify-center gap-4 pt-2">
	{#each beatIndicators as idx (idx)}
		<button
			class="data-[active=true]:bg-primary bg-muted relative size-8 cursor-pointer rounded-full transition-all"
			data-active={currentBeat === idx && isPlaying}
			onclick={() => {
				const newTriggerBeats = new Set(accentedBeats);
				if (newTriggerBeats.has(idx)) {
					newTriggerBeats.delete(idx);
				} else {
					newTriggerBeats.add(idx);
				}
				accentedBeats = newTriggerBeats;
			}}
		>
			{#if accentedBeats.has(idx)}
				<span
					class="bg-primary absolute top-full left-1/2 block size-2 -translate-x-1/2 translate-y-1/2 rounded-full"
				></span>
			{/if}
		</button>
	{/each}
</div>
