<script lang="ts">
	import { DarkModeButton } from '$lib/components/dark-mode-button';
	import { GithubButton } from '$lib/components/github-button';
	import { SignatureDialog } from '$lib/components/metronome/signature-dialog';
</script>

<header class="flex justify-between p-2">
	<DarkModeButton />
	<SignatureDialog />
	<GithubButton />
</header>
