<script lang="ts">
	import '../app.css';

	import { ParaglideJS } from '@inlang/paraglide-sveltekit';
	import { ModeWatcher } from 'mode-watcher';

	import { i18n } from '$lib/i18n';

	import Header from './Header.svelte';

	let { children } = $props();
</script>

<ModeWatcher />
<ParaglideJS {i18n}>
	<div class="flex min-h-screen flex-col">
		<Header />

		<main class="mx-auto flex w-full flex-1 flex-col">
			{@render children()}
		</main>
	</div>
</ParaglideJS>
