<!-- Collections as a large typographic list, one row per collection. -->
<script lang="ts">
	import type { CollectionListItem } from '#lib/tiendu';
	import ArrowRight from '#lib/ui/icons/ArrowRight.svelte';
	import SectionHeader from './SectionHeader.svelte';

	interface Props {
		eyebrow?: string;
		title: string;
		collections: CollectionListItem[];
	}

	let { eyebrow, title, collections }: Props = $props();
</script>

{#if collections.length}
	<section class="wrap py-section" id="categorias">
		<SectionHeader {eyebrow} {title} />
		<ul class="border-b border-line">
			{#each collections as collection (collection.handle)}
				<li class="border-t border-line">
					<a
						class="group flex items-center justify-between gap-6 py-6 md:py-8"
						href="/categorias/{collection.handle}"
					>
						<span class="text-title font-medium transition-transform duration-300 motion-safe:group-hover:translate-x-2">
							{collection.name}
						</span>
						<span class="text-muted transition-colors group-hover:text-ink"><ArrowRight size={28} strokeWidth={1.5} /></span>
					</a>
				</li>
			{/each}
		</ul>
	</section>
{/if}
