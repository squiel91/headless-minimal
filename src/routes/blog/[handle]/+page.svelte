<script lang="ts">
	import Breadcrumbs from '#lib/Breadcrumbs.svelte';
	import { formatDate } from '#lib/date';
	import BlogPreview from '#lib/sections/BlogPreview.svelte';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
	const post = $derived(data.post);
</script>

<svelte:head>
	<title>{post.seo.title || post.title} | {data.store.name}</title>
	{#if post.seo.description || post.excerpt}
		<meta name="description" content={post.seo.description || post.excerpt} />
	{/if}
	<meta property="og:type" content="article" />
	<meta property="og:title" content={post.seo.title || post.title} />
	{#if post.coverImage}<meta property="og:image" content={post.coverImage.url} />{/if}
</svelte:head>

<article class="wrap pt-8 pb-section">
	<Breadcrumbs trail={[{ label: 'Inicio', href: '/' }, { label: 'Blog', href: '/blog' }, { label: post.title }]} />

	<header class="mx-auto mt-12 mb-12 max-w-4xl md:mt-20 md:mb-16">
		{#if post.publishedAt}
			<p class="eyebrow mb-6"><time datetime={post.publishedAt}>{formatDate(post.publishedAt)}</time></p>
		{/if}
		<h1 class="text-headline font-medium text-balance">{post.title}</h1>
		{#if post.excerpt}<p class="mt-8 max-w-2xl text-xl leading-relaxed text-muted">{post.excerpt}</p>{/if}
	</header>

	{#if post.coverImage}
		<img
			class="mx-auto mb-12 block aspect-[16/9] w-full max-w-6xl rounded-(--radius-panels) bg-surface object-cover md:mb-16"
			src={post.coverImage.url}
			alt={post.coverImage.alt || post.title}
		/>
	{/if}

	<div class="mx-auto max-w-4xl">
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		<div class="rich-text">{@html post.html}</div>
		<p class="mt-16 border-t border-line pt-6">
			<a class="font-medium underline-offset-4 hover:underline" href="/blog">← Volver al blog</a>
		</p>
	</div>
</article>

<BlogPreview eyebrow="Seguí leyendo" title="Más artículos" posts={data.more} />
