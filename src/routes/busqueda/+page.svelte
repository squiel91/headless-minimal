<script lang="ts">
	import ProductListing from '#lib/ProductListing.svelte';
	import Search from '#lib/ui/icons/Search.svelte';
	import type { PageData } from './$types';
	import type { ProductListItem } from '#lib/tiendu';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	async function loadMore(page: number): Promise<{ nodes: ProductListItem[]; hasMore: boolean }> {
		const res = await fetch(`/api/busqueda?q=${encodeURIComponent(data.q)}&page=${page}`);
		if (!res.ok) throw new Error('No se pudo cargar más productos.');
		const body = await res.json();
		return { nodes: body.nodes, hasMore: body.pageInfo.hasNextPage };
	}
</script>

<svelte:head>
	<title>{data.q ? `Resultados para “${data.q}”` : 'Buscar'} | {data.store.name}</title>
</svelte:head>

<div class="wrap pt-8 pb-section">
	<form class="mt-12 mb-12 md:mt-20 md:mb-16" method="GET" action="/busqueda" role="search">
		<label class="eyebrow mb-6 block" for="q">Buscar</label>
		<div class="flex items-center gap-4 border-b border-ink pb-3">
			<input
				id="q"
				class="min-w-0 flex-1 bg-transparent text-headline font-medium !rounded-none placeholder:text-line focus:outline-none"
				type="search"
				name="q"
				value={data.q}
				placeholder="¿Qué estás buscando?"
			/>
			<button class="shrink-0 p-2" type="submit" aria-label="Buscar"><Search size={28} strokeWidth={1.5} /></button>
		</div>
	</form>

	{#if data.results}
		<p class="mb-10 border-t border-line pt-4 text-sm text-muted">Resultados para “{data.q}”</p>
		{#key `${data.q}-${data.page}`}
			<ProductListing
				products={data.results.nodes}
				page={data.page}
				hasNextPage={data.results.pageInfo.hasNextPage}
				hasPreviousPage={data.results.pageInfo.hasPreviousPage}
				{loadMore}
				pageHref={(page) => `/busqueda?q=${encodeURIComponent(data.q)}&page=${page}`}
				emptyText="No encontramos productos con esa búsqueda."
			/>
		{/key}
	{/if}
</div>
