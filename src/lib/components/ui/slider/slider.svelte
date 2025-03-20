<script lang="ts">
	import { cn } from '$lib/utils.js';

	import { Slider as SliderPrimitive } from 'bits-ui';

	import { type Props } from './index.js';

	let { className, ...restProps }: Props = $props();
</script>

<SliderPrimitive.Root
	class={cn('relative flex w-full touch-none items-center select-none', className)}
	{...restProps}
>
	{#snippet children({ ticks, thumbs })}
		<span class="bg-secondary relative h-2 w-full grow overflow-hidden rounded-full">
			<SliderPrimitive.Range class="bg-primary absolute h-full" />
		</span>
		{#each thumbs as index (index)}
			<SliderPrimitive.Thumb
				{index}
				class="border-primary bg-background ring-offset-background focus-visible:ring-ring block h-5 w-5 rounded-full border-2 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
			/>
		{/each}
		{#each ticks as index (index)}
			<SliderPrimitive.Tick {index} />
		{/each}
	{/snippet}
</SliderPrimitive.Root>
