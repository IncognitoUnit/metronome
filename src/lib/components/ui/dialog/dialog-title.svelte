<script lang="ts">
	import { Dialog as DialogPrimitive, type DialogTitleProps } from 'bits-ui';

	import { cn } from '$lib/utils.js';

	let { class: className, children, ...restProps }: DialogTitleProps = $props();
</script>

<DialogPrimitive.Title
	class={cn('text-lg leading-none font-semibold tracking-tight', className)}
	{...restProps}
>
	{@render children?.()}
</DialogPrimitive.Title>
