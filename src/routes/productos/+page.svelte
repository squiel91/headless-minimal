<script lang="ts">
	import ProductListing from '#lib/ProductListing.svelte';
	import type { PageData } from './$types';
	import type { ProductListItem } from '#lib/tiendu';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	async function loadMore(page: number): Promise<{ nodes: ProductListItem[]; hasMore: boolean }> {
		const res = await fetch(`/api/productos?page=${page}`);
		if (!res.ok) throw new Error('No se pudo cargar más productos.');
		const body = await res.json();
		return { nodes: body.nodes, hasMore: body.pageInfo.hasNextPage };
	}
</script>

<svelte:head>
	<title>Productos | {data.store.name}</title>
</svelte:head>

<div class="wrap pt-8 pb-section">
	<header class="mt-12 mb-12 md:mt-20 md:mb-16">
		<h1 class="text-display font-medium">Productos</h1>
	</header>
	<div class="mb-10 border-t border-line"></div>
	{#key data.page}
		<ProductListing
			products={data.products.nodes}
			page={data.page}
			hasNextPage={data.products.pageInfo.hasNextPage}
			hasPreviousPage={data.products.pageInfo.hasPreviousPage}
			{loadMore}
			pageHref={(page) => `/productos?page=${page}`}
		/>
	{/key}
</div>
