<script lang="ts">
	import { Minus, Music2, Plus } from '@lucide/svelte';

	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Separator } from '$lib/components/ui/separator';

	import { MAX_BEATS, MIN_BEATS, type Rhythm, RHYTHM_PATTERNS } from '../constants';
	import { changePulses, metronomeState as state } from '../state.svelte';
</script>

<Dialog.Root>
	<Dialog.Trigger
		class={buttonVariants({ variant: 'outline', size: 'icon' })}
		aria-label="Beats and Rhythm Settings"
	>
		<Music2 />
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Beats and Rhythm</Dialog.Title>
			<Dialog.Description>Adjust the beats and rhythm for your metronome.</Dialog.Description>
		</Dialog.Header>

		<div class="flex flex-col gap-6">
			<div class="flex flex-col items-center gap-2">
				<div class="flex flex-col items-center gap-2">
					<h3 class="text-center text-sm font-medium">Beats</h3>
					<div class="flex items-center gap-4">
						<Button
							onclick={() => changePulses(-1)}
							size="icon"
							variant="outline"
							disabled={state.beatsPerMeasure === MIN_BEATS}
							aria-label="Decrease beats"
						>
							<Minus />
						</Button>
						<span class="w-12 text-center font-mono text-3xl">
							{state.beatsPerMeasure}
						</span>
						<Button
							onclick={() => changePulses(1)}
							size="icon"
							variant="outline"
							disabled={state.beatsPerMeasure === MAX_BEATS}
							aria-label="Increase beats"
						>
							<Plus />
						</Button>
					</div>
				</div>
				<Separator class="my-4" />
				<div class="flex items-center gap-2">
					{#each Object.keys(RHYTHM_PATTERNS) as pattern (pattern)}
						<Button
							variant={state.currentPattern === pattern ? 'default' : 'outline'}
							aria-label={pattern}
							onclick={() => (state.currentPattern = pattern as Rhythm)}
						>
							{pattern}
						</Button>
					{/each}
				</div>
			</div>
		</div></Dialog.Content
	>
</Dialog.Root>
