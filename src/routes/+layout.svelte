<script lang="ts">
	import { i18n } from '$lib/i18n';
	import { ParaglideJS } from '@inlang/paraglide-sveltekit';
	import Header from './Header.svelte';
	import '../app.css';

	let { children } = $props();
</script>

<ParaglideJS {i18n}>
	<div class="flex min-h-screen flex-col">
		<Header></Header>

		<main class="mx-auto flex w-full flex-1 flex-col">
			{@render children()}
		</main>
	</div>
</ParaglideJS>
