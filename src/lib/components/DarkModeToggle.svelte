<script lang="ts">
	import { toggleMode } from 'mode-watcher';
	import { Button } from '$lib/components/ui/button/index.js';
	import MoonIcon from '$lib/icons/MoonIcon.svelte';
	import SunIcon from '$lib/icons/SunIcon.svelte';
</script>

<Button size="icon" onclick={toggleMode} aria-label="Toggle dark mode">
	<SunIcon className="scale-0 dark:scale-100" />
	<MoonIcon className="absolute scale-100 dark:scale-0" />
</Button>
