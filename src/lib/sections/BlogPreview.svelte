<!-- Latest blog posts. Renders nothing when the store has no posts.
     With featureFirst, the newest post leads in a large format and the rest follow as cards. -->
<script lang="ts">
	import { formatDate } from '#lib/date';
	import type { BlogPostListItem } from '#lib/tiendu';
	import ArrowRight from '#lib/ui/icons/ArrowRight.svelte';
	import SectionHeader from './SectionHeader.svelte';

	interface Props {
		eyebrow?: string;
		title: string;
		posts: BlogPostListItem[];
		linkLabel?: string;
		featureFirst?: boolean;
	}

	let { eyebrow, title, posts, linkLabel, featureFirst = false }: Props = $props();
	const featured = $derived(featureFirst ? posts[0] : undefined);
	const rest = $derived(featured ? posts.slice(1) : posts);
</script>

{#snippet featuredText(post: BlogPostListItem)}
	<p class="eyebrow mb-6 !text-current opacity-60">Último artículo · {formatDate(post.publishedAt)}</p>
	<h3 class="max-w-[18ch] text-headline font-medium text-balance underline-offset-[0.12em] group-hover:underline">
		{post.title}
	</h3>
	{#if post.excerpt}<p class="mt-6 max-w-xl text-lg leading-relaxed opacity-70">{post.excerpt}</p>{/if}
	<span class="mt-8 inline-flex items-center gap-2 font-medium">
		Leer artículo
		<span class="transition-transform motion-safe:group-hover:translate-x-1"><ArrowRight size={18} /></span>
	</span>
{/snippet}

{#if posts.length}
	<section class="wrap py-section">
		<SectionHeader {eyebrow} {title} link={linkLabel ? { label: linkLabel, href: '/blog' } : undefined} />

		{#if featured}
			<a class="group block {rest.length ? 'mb-16 md:mb-20' : ''}" href="/blog/{featured.handle}">
				{#if featured.coverImage}
					<div class="grid grid-cols-1 items-end gap-8 md:grid-cols-12 md:gap-12">
						<div class="overflow-hidden rounded-(--radius-panels) bg-surface md:col-span-7">
							<img
								class="block aspect-[4/3] w-full object-cover transition-transform duration-700 motion-safe:group-hover:scale-[1.02]"
								src={featured.coverImage.url}
								alt={featured.coverImage.alt || featured.title}
								loading="lazy"
							/>
						</div>
						<div class="md:col-span-5">
							{@render featuredText(featured)}
						</div>
					</div>
				{:else}
					<div class="rounded-(--radius-panels) bg-surface px-6 py-14 md:px-16 md:py-20">
						{@render featuredText(featured)}
					</div>
				{/if}
			</a>
		{/if}

		{#if rest.length}
			<div class="grid gap-x-6 gap-y-12 {rest.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'}">
				{#each rest as post (post.handle)}
					<a class="group block" href="/blog/{post.handle}">
						<div class="mb-5 aspect-[4/3] overflow-hidden rounded-(--radius-panels) bg-surface">
							{#if post.coverImage}
								<img
									class="block h-full w-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.03]"
									src={post.coverImage.url}
									alt={post.coverImage.alt || post.title}
									loading="lazy"
								/>
							{/if}
						</div>
						<h3 class="mb-2 text-xl leading-snug font-medium tracking-tight underline-offset-4 group-hover:underline">
							{post.title}
						</h3>
						{#if post.excerpt}<p class="line-clamp-2 text-muted">{post.excerpt}</p>{/if}
					</a>
				{/each}
			</div>
		{/if}
	</section>
{/if}
