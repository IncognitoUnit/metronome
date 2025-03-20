<script lang="ts">
	import { Button as ButtonPrimitive } from 'bits-ui';

	import { cn } from '$lib/utils.js';

	import { buttonVariants, type Props } from './index.js';

	let { variant, size, className, children, ...restProps }: Props = $props();
</script>

<ButtonPrimitive.Root class={cn(buttonVariants({ variant, size, className }))} {...restProps}>
	{@render children?.()}
</ButtonPrimitive.Root>
