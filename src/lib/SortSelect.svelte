<!-- Borderless "Ordenar por" select that reloads the page on change. -->
<script lang="ts">
	import type { SortOption } from '#lib/tiendu';

	interface Props {
		options: SortOption[];
		value: string;
	}

	let { options, value }: Props = $props();
</script>

<form method="GET" class="flex items-center gap-2 text-sm">
	<label class="text-muted" for="sort">Ordenar por</label>
	<span class="relative">
		<select
			id="sort"
			class="cursor-pointer appearance-none bg-transparent py-1 pr-6 [field-sizing:content] font-medium focus:outline-none focus-visible:underline"
			name="sort"
			onchange={(event) => event.currentTarget.form?.requestSubmit()}
		>
			{#each options as option (option.value)}
				<option value={option.value} selected={option.value === value}>{option.label}</option>
			{/each}
		</select>
		<svg class="pointer-events-none absolute top-1/2 right-0 -translate-y-1/2" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
	</span>
	<noscript><button class="font-medium underline" type="submit">Aplicar</button></noscript>
</form>
