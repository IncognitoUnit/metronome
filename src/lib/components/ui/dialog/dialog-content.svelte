<script lang="ts">
	import { X } from '@lucide/svelte';
	import { Dialog as DialogPrimitive } from 'bits-ui';

	import { cn } from '$lib/utils.js';

	import * as Dialog from './index.js';

	let { class: className, children, ...restProps }: DialogPrimitive.ContentProps = $props();
</script>

<Dialog.Portal>
	<Dialog.Overlay />
	<DialogPrimitive.Content
		class={cn(
			'bg-background fixed top-[50%] left-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 p-6 shadow-lg sm:rounded-lg md:w-full',
			className,
		)}
		{...restProps}
	>
		{@render children?.()}
		<DialogPrimitive.Close
			class="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 cursor-pointer rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:pointer-events-none"
			aria-label="Close"
		>
			<X size={16} />
		</DialogPrimitive.Close>
	</DialogPrimitive.Content>
</Dialog.Portal>
