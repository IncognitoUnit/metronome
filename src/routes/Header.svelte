<script lang="ts">
	import { DarkModeButton } from '$lib/components/dark-mode-button';
	import { GithubButton } from '$lib/components/github-button';
	import { SettingsDialog } from '$lib/components/metronome/settings-dialog';
</script>

<header class="flex justify-between p-2">
	<DarkModeButton />
	<SettingsDialog />
	<GithubButton />
</header>
