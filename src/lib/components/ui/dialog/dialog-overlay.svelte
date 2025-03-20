<script lang="ts">
	import { Dialog as DialogPrimitive, type DialogOverlayProps } from 'bits-ui';

	import { cn } from '$lib/utils.js';

	let { class: className, ...restProps }: DialogOverlayProps = $props();
</script>

<DialogPrimitive.Overlay
	class={cn('bg-background/80 fixed inset-0 z-50 backdrop-blur-sm', className)}
	{...restProps}
/>
