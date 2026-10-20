<script lang="ts">
	import Breadcrumbs from '#lib/Breadcrumbs.svelte';
	import ProductListing from '#lib/ProductListing.svelte';
	import SortSelect from '#lib/SortSelect.svelte';
	import type { ProductListItem } from '#lib/tiendu';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
	const collection = $derived(data.collection);
	const chip = 'rounded-(--radius-controls) border px-4 py-2 text-sm transition-colors';

	async function loadMore(page: number): Promise<{ nodes: ProductListItem[]; hasMore: boolean }> {
		const res = await fetch(
			`/api/categorias/${data.handle}/productos?page=${page}&sort=${data.sort}`
		);
		if (!res.ok) throw new Error('No se pudo cargar más productos.');
		const body = await res.json();
		return { nodes: body.nodes, hasMore: body.pageInfo.hasNextPage };
	}
</script>

<svelte:head>
	<title>{collection.seo.title || collection.name} | {data.store.name}</title>
	{#if collection.seo.description}
		<meta name="description" content={collection.seo.description} />
	{/if}
</svelte:head>

<div class="wrap pt-8 pb-section">
	<Breadcrumbs
		trail={[
			{ label: 'Inicio', href: '/' },
			...(collection.parent
				? [{ label: collection.parent.name, href: `/categorias/${collection.parent.handle}` }]
				: []),
			{ label: collection.name }
		]}
	/>

	<header class="mt-12 mb-12 md:mt-20 md:mb-16">
		<h1 class="text-display font-medium text-balance">{collection.name}</h1>
		{#if collection.description}
			<p class="mt-8 max-w-xl text-lg leading-relaxed whitespace-pre-line text-muted">{collection.description}</p>
		{/if}
	</header>

	{#if collection.children.length}
		<nav class="mb-8 flex flex-wrap gap-2" aria-label="Subcategorías">
			<span class="{chip} border-ink bg-ink text-paper" aria-current="page">Todo</span>
			{#each collection.children as child (child.handle)}
				<a class="{chip} border-line hover:border-ink" href="/categorias/{child.handle}">{child.name}</a>
			{/each}
		</nav>
	{/if}

	<div class="mb-10 flex items-center justify-between gap-4 border-y border-line py-4">
		<p class="text-sm text-muted">
			{collection.productCount}
			{collection.productCount === 1 ? 'producto' : 'productos'}
		</p>
		<SortSelect options={collection.sortOptions} value={data.sort} />
	</div>

	{#key `${data.handle}-${data.sort}-${data.page}`}
		<ProductListing
			products={collection.products.nodes}
			page={data.page}
			hasNextPage={collection.products.pageInfo.hasNextPage}
			hasPreviousPage={collection.products.pageInfo.hasPreviousPage}
			{loadMore}
			pageHref={(page) => `?page=${page}&sort=${data.sort}`}
			emptyText="Todavía no hay productos en esta categoría."
		/>
	{/key}
</div>
