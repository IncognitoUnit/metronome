<script lang="ts">
	import { Popover as PopoverPrimitive } from 'bits-ui';

	import { cn } from '$lib/utils.js';

	import type { Props } from './index';

	let { align, sideOffset, class: className, children, ...restProps }: Props = $props();
</script>

<PopoverPrimitive.Content
	{align}
	{sideOffset}
	{...restProps}
	class={cn(
		'bg-popover text-popover-foreground border-muted z-50 mt-2 w-72 rounded-md border p-4 shadow-md outline-none',
		className,
	)}
>
	{@render children?.()}
</PopoverPrimitive.Content>
