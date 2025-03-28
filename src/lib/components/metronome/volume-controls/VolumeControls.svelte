<script lang="ts">
	import { Volume, Volume1, Volume2, VolumeX } from '@lucide/svelte';

	import { buttonVariants } from '$lib/components/ui/button';
	import * as Popover from '$lib/components/ui/popover';
	import { Slider } from '$lib/components/ui/slider';

	import { MAX_VOLUME_PERCENT, MIN_VOLUME_PERCENT } from '../constants';
	import { metronomeState as state } from '../state.svelte';
	let VolumeIcon = $derived.by(() => getVolumeIcon(state.volumePercent));

	function getVolumeIcon(volumePercent: number) {
		if (volumePercent === 0) {
			return VolumeX; // Muted
		} else if (volumePercent > 0 && volumePercent <= 33) {
			return Volume; // Low volume
		} else if (volumePercent > 33 && volumePercent <= 66) {
			return Volume1; // Medium volume
		} else {
			return Volume2; // High volume
		}
	}
</script>

<Popover.Root>
	<Popover.Trigger
		class={buttonVariants({ variant: 'outline', size: 'icon' })}
		aria-label="Volume Controls"
	>
		<VolumeIcon />
	</Popover.Trigger>
	<Popover.Content class="h-48" sideOffset={8}>
		<Slider
			min={MIN_VOLUME_PERCENT}
			max={MAX_VOLUME_PERCENT}
			type="single"
			orientation="vertical"
			value={state.volumePercent}
			onValueChange={(value) => {
				state.volumePercent = value;
			}}
		/>
	</Popover.Content>
</Popover.Root>
