<!-- Product grid with infinite loading, no-JS pagination and an empty state.
     Shared by collection, all-products and search pages. -->
<script lang="ts">
	import ProductCard from '#lib/ProductCard.svelte';
	import { InfiniteList, type InfinitePage } from '#lib/infinite.svelte';
	import type { ProductListItem } from '#lib/tiendu';
	import ArrowRight from '#lib/ui/icons/ArrowRight.svelte';

	interface Props {
		products: ProductListItem[];
		page: number;
		hasNextPage: boolean;
		hasPreviousPage: boolean;
		loadMore: (page: number) => Promise<InfinitePage<ProductListItem>>;
		pageHref: (page: number) => string;
		emptyText?: string;
	}

	let {
		products,
		page,
		hasNextPage,
		hasPreviousPage,
		loadMore,
		pageHref,
		emptyText = 'Todavía no hay productos acá.'
	}: Props = $props();

	let loader = $derived(new InfiniteList<ProductListItem>(products, page, hasNextPage, loadMore));
</script>

{#if loader.items.length}
	<div class="grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 md:gap-x-6 xl:grid-cols-4">
		{#each loader.items as product (product.handle)}
			<ProductCard {product} />
		{/each}
	</div>
	<div use:loader.observe></div>
	{#if loader.loading}
		<p class="mt-12 text-center text-sm text-muted" role="status">Cargando más productos…</p>
	{/if}
{:else}
	<div class="py-24">
		<p class="text-title font-medium">{emptyText}</p>
		<a class="group mt-6 inline-flex items-center gap-2 font-medium" href="/productos">
			<span class="underline-offset-4 group-hover:underline">Ver todos los productos</span>
			<span class="transition-transform motion-safe:group-hover:translate-x-1"><ArrowRight size={18} /></span>
		</a>
	</div>
{/if}

<noscript>
	<nav class="mt-16 flex items-center justify-between border-t border-line pt-6" aria-label="Paginación">
		{#if hasPreviousPage}
			<a class="font-medium underline-offset-4 hover:underline" href={pageHref(page - 1)}>← Anterior</a>
		{:else}
			<span></span>
		{/if}
		<span class="text-sm text-muted">Página {page}</span>
		{#if hasNextPage}
			<a class="font-medium underline-offset-4 hover:underline" href={pageHref(page + 1)}>Siguiente →</a>
		{:else}
			<span></span>
		{/if}
	</nav>
</noscript>
