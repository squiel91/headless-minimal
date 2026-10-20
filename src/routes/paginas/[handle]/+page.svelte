<script lang="ts">
	import Breadcrumbs from '#lib/Breadcrumbs.svelte';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
	const page = $derived(data.page);
	// Merchant pages often open by repeating their title as a heading; drop it.
	const html = $derived(
		page.title
			? page.html.replace(/^\s*<h[12][^>]*>([\s\S]*?)<\/h[12]>/i, (match, inner: string) =>
					inner.replace(/<[^>]+>/g, '').trim().toLowerCase() === page.title?.trim().toLowerCase()
						? ''
						: match
				)
			: page.html
	);
</script>

<svelte:head>
	<title>{page.seo.title || page.title || 'Página'} | {data.store.name}</title>
	{#if page.seo.description}<meta name="description" content={page.seo.description} />{/if}
</svelte:head>

<div class="wrap pt-8 pb-section">
	<Breadcrumbs trail={[{ label: 'Inicio', href: '/' }, { label: page.title ?? 'Página' }]} />

	<div class="mt-12 grid grid-cols-1 gap-8 md:mt-20 md:grid-cols-12 md:gap-16">
		<h1 class="text-headline font-medium text-balance md:sticky md:top-32 md:col-span-5 md:self-start">{page.title}</h1>
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		<div class="rich-text md:col-span-7 md:pt-3">{@html html}</div>
	</div>
</div>
