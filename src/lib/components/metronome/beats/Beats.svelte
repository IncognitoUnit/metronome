<script lang="ts">
	import { metronomeState as state } from '../state.svelte';

	let beatIndicators = $derived(Array.from({ length: state.beatsPerMeasure }, (_, index) => index));
</script>

<div class="group flex w-full flex-wrap justify-center gap-4 pt-2" data-pulse={state.showPulse}>
	{#each beatIndicators as idx (idx)}
		<button
			class="group-data-[pulse=true]:data-[active=true]:bg-primary bg-muted relative size-8 cursor-pointer rounded-full transition-all duration-50"
			data-active={state.currentBeat === idx && state.isPlaying}
			aria-label={`Beat ${idx + 1} Toggle Accent`}
			onclick={() => {
				const newTriggerBeats = new Set(state.accentedBeats);
				if (newTriggerBeats.has(idx)) {
					newTriggerBeats.delete(idx);
				} else {
					newTriggerBeats.add(idx);
				}
				state.accentedBeats = newTriggerBeats;
			}}
		>
			<span
				class="bg-primary pointer-events-none absolute top-full left-1/2 size-2 -translate-x-1/2 translate-y-1/2 rounded-full opacity-0 transition-all data-[accented=true]:opacity-100"
				data-accented={state.accentedBeats.has(idx)}
			></span>
		</button>
	{/each}
</div>
