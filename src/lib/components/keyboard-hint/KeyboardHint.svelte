<script lang="ts">
	import { clsx } from 'clsx';
	import { type HTMLAttributes } from 'svelte/elements';

	let { class: className, children, ...restProps }: HTMLAttributes<HTMLDivElement> = $props();
</script>

<div
	class={clsx('bg-muted flex items-center rounded-md p-0.5 select-none', className)}
	{...restProps}
>
	{@render children?.()}
</div>
