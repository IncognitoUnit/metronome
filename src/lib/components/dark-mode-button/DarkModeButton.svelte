<script lang="ts">
	import { Moon, Sun } from '@lucide/svelte';
	import { mode, toggleMode } from 'mode-watcher';

	import { Button } from '$lib/components/ui/button';
</script>

<Button size="icon" onclick={toggleMode} aria-label="Toggle dark mode">
	<Sun
		class="scale-100 rotate-0 transition-all data-[active=false]:scale-0 data-[active=false]:-rotate-90"
		data-active={$mode === 'dark'}
	/>
	<Moon
		class="absolute scale-0 rotate-90 transition-all data-[active=true]:scale-100 data-[active=true]:rotate-0"
		data-active={$mode === 'light'}
	/>
</Button>
