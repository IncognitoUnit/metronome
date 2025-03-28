<script lang="ts">
	import { Minus, Music2, Plus } from '@lucide/svelte';

	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';

	import { MAX_BEATS, MIN_BEATS } from '../constants';
	import { changeBeats, metronomeState as state } from '../state.svelte';
</script>

<Dialog.Root>
	<Dialog.Trigger
		class={buttonVariants({ variant: 'outline', size: 'icon' })}
		aria-label="Time Signature Settings"
	>
		<Music2 />
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Time Signature</Dialog.Title>
			<Dialog.Description>
				Adjust the beats per measure and beat unit for your metronome.
			</Dialog.Description>
		</Dialog.Header>

		<div class="flex flex-col gap-6">
			<div class="flex flex-col items-center gap-2">
				<div class="flex flex-col items-center gap-2">
					<h3 class="text-center text-sm font-medium">Beats Per Measure</h3>
					<div class="flex items-center gap-4">
						<Button
							onclick={() => changeBeats(-1)}
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
							onclick={() => changeBeats(1)}
							size="icon"
							variant="outline"
							disabled={state.beatsPerMeasure === MAX_BEATS}
							aria-label="Increase beats"
						>
							<Plus />
						</Button>
					</div>
				</div>
			</div>
		</div></Dialog.Content
	>
</Dialog.Root>
