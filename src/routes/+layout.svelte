<script lang="ts">
	import { i18n } from '$lib/i18n';
	import { ParaglideJS } from '@inlang/paraglide-sveltekit';
	import Header from './Header.svelte';
	import '../app.css';
	import { ModeWatcher } from 'mode-watcher';

	let { children } = $props();
</script>

<ModeWatcher />
<ParaglideJS {i18n}>
	<div class="flex min-h-screen flex-col gap-4">
		<Header></Header>

		<main class="mx-auto flex w-full flex-1 flex-col">
			{@render children()}
		</main>
	</div>
</ParaglideJS>
