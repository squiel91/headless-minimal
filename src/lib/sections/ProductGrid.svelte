<!-- A titled row of product cards: featured collection, best sellers, etc. -->
<script lang="ts">
	import ProductCard from '#lib/ProductCard.svelte';
	import type { ProductListItem } from '#lib/tiendu';
	import SectionHeader from './SectionHeader.svelte';

	interface Props {
		eyebrow?: string;
		title: string;
		products: ProductListItem[];
		link?: { label: string; href: string };
	}

	let { eyebrow, title, products, link }: Props = $props();
</script>

{#if products.length}
	<section class="wrap py-section">
		<SectionHeader {eyebrow} {title} {link} />
		<div class="grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-6 lg:grid-cols-4">
			{#each products as product (product.handle)}
				<ProductCard {product} />
			{/each}
		</div>
	</section>
{/if}
