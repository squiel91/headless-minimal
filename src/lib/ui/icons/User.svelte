<script lang="ts">
	let { size = 20 }: { size?: number } = $props();
</script>

<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
	<circle cx="12" cy="8" r="4" />
	<path d="M20 21v-2a8 8 0 0 0-16 0v2" />
</svg>
