<script lang="ts">
	import { Minus, Music2, Plus } from '@lucide/svelte';

	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';

	import { MAX_BEATS, MIN_BEATS, VALID_BEAT_UNITS } from '../constants';
	import { metronomeState as state } from '../state.svelte';

	function changeBeats(change: number) {
		state.beatsPerMeasure = Math.max(
			Math.min(state.beatsPerMeasure + change, MAX_BEATS),
			MIN_BEATS,
		);
	}

	function changeBeatUnit(direction: 'up' | 'down') {
		const currentIndex = VALID_BEAT_UNITS.indexOf(state.beatUnit);
		let newIndex: number;

		if (direction === 'up') {
			newIndex = currentIndex < VALID_BEAT_UNITS.length - 1 ? currentIndex + 1 : 0;
		} else {
			newIndex = currentIndex > 0 ? currentIndex - 1 : VALID_BEAT_UNITS.length - 1;
		}

		state.beatUnit = VALID_BEAT_UNITS[newIndex];
	}
</script>

<Dialog.Root>
	<Dialog.Trigger
		tabindex={-1}
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

		<div class="my-6 flex flex-col gap-6">
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
					<span class="w-12 text-center font-mono text-2xl">
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

			<div class="flex flex-col items-center gap-2">
				<h3 class="text-center text-sm font-medium">Beat Unit</h3>
				<div class="flex items-center gap-4">
					<Button
						onclick={() => changeBeatUnit('down')}
						size="icon"
						variant="outline"
						disabled={state.beatUnit === VALID_BEAT_UNITS[0]}
						aria-label="Decrease beat unit"
					>
						<Minus />
					</Button>
					<span class="w-12 text-center font-mono text-3xl">
						{state.beatUnit}
					</span>
					<Button
						onclick={() => changeBeatUnit('up')}
						size="icon"
						variant="outline"
						disabled={state.beatUnit === VALID_BEAT_UNITS[VALID_BEAT_UNITS.length - 1]}
						aria-label="Increase beat unit"
					>
						<Plus />
					</Button>
				</div>
			</div>
		</div>
		<Dialog.Footer>
			<Dialog.Close>
				<Button variant="secondary">Close</Button>
			</Dialog.Close>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
