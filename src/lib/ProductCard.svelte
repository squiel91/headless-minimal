<script lang="ts">
	import { formatMoney } from '#lib/money.js';
	import Rating from '#lib/Rating.svelte';
	import WishlistButton from '#lib/WishlistButton.svelte';
	import type { ProductListItem } from '#lib/tiendu';

	let { product }: { product: ProductListItem } = $props();
	const hasRange = $derived(
		product.priceMinInCents != null &&
			product.priceMaxInCents != null &&
			product.priceMaxInCents > product.priceMinInCents
	);
	const priceLabel = $derived(
		(hasRange ? 'Desde ' : '') + formatMoney(product.priceMinInCents, product.currency)
	);
</script>

<div class="relative">
	<a class="group block text-inherit no-underline" href="/productos/{product.handle}">
		<div class="aspect-[4/5] w-full overflow-hidden rounded-(--radius-panels) bg-surface">
			<img
				class="block h-full w-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.03]"
				src={product.coverImage?.url ?? '/placeholder.svg'}
				alt={product.coverImage?.alt || product.title}
				loading="lazy"
			/>
		</div>
		<div class="pt-3">
			<span class="mb-1 block line-clamp-2 leading-snug group-hover:underline group-hover:underline-offset-4">{product.title}</span>
			<Rating rating={product.rating ?? null} count={product.reviewsCount ?? 0} />
			<span>{priceLabel}</span>
			{#if product.compareAtPriceInCents != null}
				<s class="ml-1.5 text-muted/70">{formatMoney(product.compareAtPriceInCents, product.currency)}</s>
			{/if}
		</div>
		{#if !product.available}
			<span class="absolute top-3 left-3 rounded-(--radius-controls) bg-paper px-2 py-1 text-xs font-medium text-ink">
				Agotado
			</span>
		{/if}
	</a>
	<div class="absolute top-2 right-2">
		<WishlistButton productId={product.id} title={product.title} />
	</div>
</div>
