<script lang="ts">
	import Star from '#lib/ui/icons/Star.svelte';
	import { formatRating, ratingFillPercent } from '#lib/rating';

	interface Props {
		rating: number | null;
		count: number;
		showCount?: boolean;
		starSize?: number | string;
	}

	let { rating, count, showCount = true, starSize = 14 }: Props = $props();
	const label = $derived(rating == null ? null : formatRating(rating));
	const percent = $derived(rating == null ? 0 : ratingFillPercent(rating));
	const row = [0, 1, 2, 3, 4];
</script>

{#if rating != null && count > 0}
	<p class="flex items-center gap-1.5 text-sm" aria-label="Calificación {label} de 5 basada en {count} opiniones">
		<span class="relative inline-flex" aria-hidden="true">
			<span class="inline-flex gap-0.5 text-neutral-300">
				{#each row as i (i)}
					<span class="inline-flex flex-none"><Star size={starSize} fill="currentColor" /></span>
				{/each}
			</span>
			<span
				class="absolute top-0 left-0 flex h-full gap-0.5 overflow-hidden text-(--primary)"
				style="width: {percent}%"
			>
				{#each row as i (i)}
					<span class="inline-flex flex-none"><Star size={starSize} fill="currentColor" /></span>
				{/each}
			</span>
		</span>
		{#if showCount}
			<span>{label} ({count})</span>
		{:else}
			<span>{label}</span>
		{/if}
	</p>
{/if}
