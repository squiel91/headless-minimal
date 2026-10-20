import type { ProductDetail } from '#lib/tiendu';

/** Build a schema.org Product JSON-LD object from a product detail. */
export function buildProductJsonLd(product: ProductDetail): Record<string, unknown> {
	const seen = new Set<string>();
	const images: string[] = [];
	for (const url of [
		product.coverImage?.url,
		...(product.images ?? []).map((image) => image.url)
	]) {
		// Only absolute store URLs help search engines; skip the local placeholder.
		if (url && url.startsWith('http') && !seen.has(url)) {
			seen.add(url);
			images.push(url);
		}
	}

	const offers = (product.variants ?? [])
		.filter((v) => v.priceInCents != null)
		.map((v) => ({
			'@type': 'Offer',
			price: (v.priceInCents as number) / 100,
			priceCurrency: product.currency,
			availability: v.available
				? 'https://schema.org/InStock'
				: 'https://schema.org/OutOfStock',
			...(v.sku ? { sku: v.sku } : {})
		}));

	const jsonLd: Record<string, unknown> = {
		'@context': 'https://schema.org',
		'@type': 'Product',
		name: product.title
	};
	if (product.description) jsonLd.description = product.description;
	if (images.length > 0) jsonLd.image = images;

	const sku = (product.variants ?? []).find((v) => v.sku)?.sku;
	if (sku) jsonLd.sku = sku;

	if (product.rating != null && product.reviewsCount > 0) {
		jsonLd.aggregateRating = {
			'@type': 'AggregateRating',
			ratingValue: product.rating,
			reviewCount: product.reviewsCount
		};
	}

	if (product.reviews?.length > 0) {
		jsonLd.review = product.reviews.map((review) => ({
			'@type': 'Review',
			author: { '@type': 'Person', name: review.authorName },
			reviewRating: {
				'@type': 'Rating',
				ratingValue: review.rating,
				bestRating: 5
			},
			reviewBody: review.content
		}));
	}

	if (offers.length === 1) jsonLd.offers = offers[0];
	else if (offers.length > 1) jsonLd.offers = offers;

	return jsonLd;
}
