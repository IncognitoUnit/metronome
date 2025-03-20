<script lang="ts">
	import { Dialog as DialogPrimitive, type DialogPortalProps } from 'bits-ui';

	let { children, ...restProps }: DialogPortalProps = $props();
</script>

<DialogPrimitive.Portal {...restProps}>
	{@render children?.()}
</DialogPrimitive.Portal>
