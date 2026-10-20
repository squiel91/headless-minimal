<script lang="ts">
	import { content } from '#lib/content';
	import { formatDate } from '#lib/date';
	import ArrowRight from '#lib/ui/icons/ArrowRight.svelte';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
</script>

<svelte:head>
	<title>Blog | {data.store.name}</title>
</svelte:head>

<div class="wrap pt-8 pb-section">
	<header class="mt-12 mb-12 md:mt-20 md:mb-16">
		<p class="eyebrow mb-6">{content.blog.eyebrow}</p>
		<h1 class="text-display font-medium text-balance">{content.blog.title}</h1>
	</header>

	{#if !data.nodes.length}
		<p class="border-t border-line py-24 text-title font-medium">Todavía no hay artículos.</p>
	{:else}
		<ul class="border-b border-line">
			{#each data.nodes as post (post.handle)}
				<li class="border-t border-line">
					<a class="group grid grid-cols-1 gap-4 py-8 md:grid-cols-12 md:gap-8 md:py-12" href="/blog/{post.handle}">
						<p class="text-sm text-muted md:col-span-3 md:pt-2">{formatDate(post.publishedAt)}</p>
						<div class="md:col-span-6">
							<h2 class="text-title font-medium text-balance underline-offset-4 group-hover:underline">{post.title}</h2>
							{#if post.excerpt}<p class="mt-4 max-w-xl text-lg leading-relaxed text-muted">{post.excerpt}</p>{/if}
							<span class="mt-6 inline-flex items-center gap-2 font-medium">
								Leer artículo
								<span class="transition-transform motion-safe:group-hover:translate-x-1"><ArrowRight size={18} /></span>
							</span>
						</div>
						{#if post.coverImage}
							<div class="order-first overflow-hidden rounded-(--radius-panels) bg-surface md:order-none md:col-span-3">
								<img
									class="block aspect-[4/3] w-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.03]"
									src={post.coverImage.url}
									alt={post.coverImage.alt || post.title}
									loading="lazy"
								/>
							</div>
						{/if}
					</a>
				</li>
			{/each}
		</ul>

		{#if data.pageInfo.totalPages > 1}
			<nav class="mt-12 flex items-center justify-between" aria-label="Paginación">
				{#if data.pageInfo.hasPreviousPage}
					<a class="font-medium underline-offset-4 hover:underline" href="/blog?page={data.page - 1}">← Anterior</a>
				{:else}
					<span></span>
				{/if}
				<span class="text-sm text-muted">Página {data.pageInfo.currentPage} de {data.pageInfo.totalPages}</span>
				{#if data.pageInfo.hasNextPage}
					<a class="font-medium underline-offset-4 hover:underline" href="/blog?page={data.page + 1}">Siguiente →</a>
				{:else}
					<span></span>
				{/if}
			</nav>
		{/if}
	{/if}
</div>
