<script lang="ts">
	import { Moon, Sun } from '@lucide/svelte';
	import { mode, toggleMode } from 'mode-watcher';

	import { Button } from '$lib/components/ui/button';
</script>

<Button variant="outline" size="icon" onclick={toggleMode} aria-label="Toggle dark mode">
	<Sun
		class="scale-100 rotate-0 transition-all data-[isdark=false]:scale-0 data-[isdark=false]:-rotate-90"
		data-isdark={$mode === 'dark'}
	/>
	<Moon
		class="absolute scale-0 rotate-90 transition-all data-[isdark=true]:scale-100 data-[isdark=true]:rotate-0"
		data-isdark={$mode === 'light'}
	/>
</Button>
