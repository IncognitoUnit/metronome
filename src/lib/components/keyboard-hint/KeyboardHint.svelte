<script lang="ts">
	import { clsx } from 'clsx';
	import { type HTMLAttributes } from 'svelte/elements';

	let { class: className, children, ...restProps }: HTMLAttributes<HTMLDivElement> = $props();
</script>

<div class={clsx('border-muted rounded-md border-2', className)} {...restProps}>
	{@render children?.()}
</div>
