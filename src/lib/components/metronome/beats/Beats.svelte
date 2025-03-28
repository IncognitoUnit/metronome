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

<div class="flex w-full flex-wrap justify-center gap-4 pt-2">
	{#each beatIndicators as idx (idx)}
		<button
			class="data-[active=true]:bg-primary bg-muted relative size-8 cursor-pointer rounded-full transition-all"
			data-active={currentBeat === idx && isPlaying}
			aria-label={`Beat ${idx + 1} Toggle Accent`}
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
			<span
				class="bg-primary pointer-events-none absolute top-full left-1/2 size-2 -translate-x-1/2 translate-y-1/2 rounded-full opacity-0 transition-all data-[accented=true]:opacity-100"
				data-accented={accentedBeats.has(idx)}
			></span>
		</button>
	{/each}
</div>
