<script lang="ts">
	import { content } from '#lib/content';
	import Benefits from '#lib/sections/Benefits.svelte';
	import BlogPreview from '#lib/sections/BlogPreview.svelte';
	import CollectionList from '#lib/sections/CollectionList.svelte';
	import Hero from '#lib/sections/Hero.svelte';
	import ProductGrid from '#lib/sections/ProductGrid.svelte';
	import Split from '#lib/sections/Split.svelte';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
</script>

<svelte:head>
	<title>{data.store.name}</title>
	{#if data.store.description}<meta name="description" content={data.store.description.slice(0, 160)} />{/if}
</svelte:head>

<!-- Homepage = an ordered list of sections. Reorder, remove or repeat them here;
     their copy lives in #lib/content. -->
<Hero {...content.hero} />

<ProductGrid
	eyebrow={content.featured.eyebrow}
	title={data.featured.title}
	products={data.featured.products}
	link={{ label: content.featured.linkLabel, href: data.featured.href }}
/>

<Split {...content.split} />

<CollectionList {...content.collections} collections={data.collections} />

<Benefits items={content.benefits} />

<BlogPreview {...content.blog} posts={data.posts} featureFirst />
