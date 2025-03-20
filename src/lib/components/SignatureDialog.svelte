<script lang="ts">
	import { Minus, Plus, Signature } from '@lucide/svelte';

	import { Button } from './ui/button';
	import * as Dialog from './ui/dialog';

	// Time signature state via props
	let { beatsPerMeasure = $bindable(4), beatUnit = $bindable(4) } = $props();

	// Constraints
	const MIN_BEATS = 1;
	const MAX_BEATS = 12;
	const VALID_BEAT_UNITS = [4, 8, 16];

	function changeBeats(change: number) {
		beatsPerMeasure = Math.max(Math.min(beatsPerMeasure + change, MAX_BEATS), MIN_BEATS);
	}

	function changeBeatUnit(direction: 'up' | 'down') {
		const currentIndex = VALID_BEAT_UNITS.indexOf(beatUnit);
		let newIndex: number;

		if (direction === 'up') {
			newIndex = currentIndex < VALID_BEAT_UNITS.length - 1 ? currentIndex + 1 : 0;
		} else {
			newIndex = currentIndex > 0 ? currentIndex - 1 : VALID_BEAT_UNITS.length - 1;
		}

		beatUnit = VALID_BEAT_UNITS[newIndex];
	}
</script>

<Dialog.Root>
	<Dialog.Trigger>
		<Button variant="outline" size="icon" aria-label="Time Signature Settings">
			<Signature />
		</Button>
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
						aria-label="Decrease beats"
					>
						<Minus />
					</Button>
					<span class="w-12 text-center font-mono text-2xl">
						{beatsPerMeasure}
					</span>
					<Button
						onclick={() => changeBeats(1)}
						size="icon"
						variant="outline"
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
						aria-label="Decrease beat unit"
					>
						<Minus />
					</Button>
					<span class="w-12 text-center font-mono text-2xl">
						{beatUnit}
					</span>
					<Button
						onclick={() => changeBeatUnit('up')}
						size="icon"
						variant="outline"
						aria-label="Increase beat unit"
					>
						<Plus />
					</Button>
				</div>
			</div>
		</div>

		<div class="text-center font-mono text-3xl font-bold">
			{beatsPerMeasure}/{beatUnit}
		</div>

		<Dialog.Footer>
			<Dialog.Close>
				<Button variant="secondary">Close</Button>
			</Dialog.Close>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
