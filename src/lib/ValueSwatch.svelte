<script lang="ts">
	import type { OptionValue } from '#lib/tiendu';

	interface Props {
		value: OptionValue;
		label: string;
	}

	let { value, label }: Props = $props();
</script>

{#if value.image}
	<img
		class="block aspect-square w-10 shrink-0 object-cover"
		src={value.image.url}
		alt={label}
		loading="lazy"
	/>
{:else if value.color}
	<span
		class="block aspect-square w-10 shrink-0 shadow-[inset_-1px_0_0_rgb(0_0_0/0.08)]"
		style="background-color: {value.color}"
		aria-hidden="true"
	></span>
{/if}
