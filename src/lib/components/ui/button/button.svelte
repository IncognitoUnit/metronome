<script lang="ts">
	import { Button as ButtonPrimitive } from 'bits-ui';

	import { cn } from '$lib/utils';

	import { buttonVariants, type Props } from './index';

	let { variant, size, class: className, children, ...restProps }: Props = $props();
</script>

<ButtonPrimitive.Root class={cn(buttonVariants({ variant, size }), className)} {...restProps}>
	{@render children?.()}
</ButtonPrimitive.Root>
