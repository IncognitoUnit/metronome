<script lang="ts">
	import { Separator as SeparatorPrimitive, type SeparatorRootProps } from 'bits-ui';

	import { cn } from '$lib/utils.js';

	let {
		orientation = 'horizontal',
		decorative = false,
		class: className,
		...restProps
	}: SeparatorRootProps = $props();
</script>

<SeparatorPrimitive.Root
	class={cn(
		'bg-border shrink-0',
		orientation === 'horizontal' ? 'h-[1px] w-full' : 'min-h-full w-[1px]',
		className,
	)}
	{orientation}
	{decorative}
	{...restProps}
/>
