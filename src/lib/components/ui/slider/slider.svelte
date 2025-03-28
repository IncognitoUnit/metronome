<script lang="ts">
	import { Slider as SliderPrimitive, type SliderRootProps } from 'bits-ui';

	import { cn } from '$lib/utils';

	let { orientation, class: className, ...restProps }: SliderRootProps = $props();

	let isVertical = $derived(orientation === 'vertical');
</script>

<SliderPrimitive.Root
	class={cn(
		'relative flex touch-none items-center select-none',
		isVertical ? 'h-full' : 'w-full',
		className,
	)}
	{...restProps}
>
	{#snippet children({ ticks, thumbs })}
		<span
			class={cn(
				'bg-secondary relative grow overflow-hidden rounded-full',
				isVertical ? 'h-full w-2' : 'h-2 w-full',
			)}
		>
			<SliderPrimitive.Range class={cn('bg-primary absolute', isVertical ? 'w-full' : 'h-full')} />
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
