<script lang="ts">
	import type { IconProps } from './icon';

	let { size = 24, className = '' }: IconProps = $props();
</script>

<svg
	width={size}
	height={size}
	class={className}
	viewBox="0 0 24 24"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
>
	<path
		d="M6 12H18M12 6V18"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
	/>
</svg>
