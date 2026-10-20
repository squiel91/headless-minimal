import { describe, expect, it } from 'vitest';
import { buildProductJsonLd } from '#lib/productJsonLd';
import type { ProductDetail } from '#lib/tiendu';

const base: ProductDetail = {
	id: '1',
	title: 'Lámpara',
	description: 'Lámpara de prueba.',
	currency: 'UYU',
	priceMinInCents: 5000,
	priceMaxInCents: 10000,
	available: true,
	coverImage: { url: 'https://cdn.test/lampara.jpg', alt: 'Lámpara' },
	images: [{ url: 'https://cdn.test/lampara.jpg', alt: 'Lámpara' }],
	videoUrl: null,
	options: [],
	variants: [
		{
			id: 'v1',
			image: null,
			sku: 'LAMP-1',
			priceInCents: 5000,
			compareAtPriceInCents: null,
			stock: 3,
			available: true,
			selectedOptions: []
		}
	],
	specifications: [],
	related: [],
	seo: { title: null, description: null },
	rating: 4.5,
	reviewsCount: 2,
	reviews: [
		{ rating: 5, content: 'Excelente.', authorName: 'Ana', verifiedPurchase: true, images: [] },
		{ rating: 4, content: 'Buena.', authorName: 'Luis', verifiedPurchase: false, images: [] }
	]
};

describe('buildProductJsonLd', () => {
	it('builds offers with price and availability', () => {
		const jsonLd = buildProductJsonLd(base);
		expect(jsonLd['@type']).toBe('Product');
		expect(jsonLd.offers).toEqual({
			'@type': 'Offer',
			price: 50,
			priceCurrency: 'UYU',
			availability: 'https://schema.org/InStock',
			sku: 'LAMP-1'
		});
	});

	it('includes aggregateRating and reviews when present', () => {
		const jsonLd = buildProductJsonLd(base);
		expect(jsonLd.aggregateRating).toEqual({
			'@type': 'AggregateRating',
			ratingValue: 4.5,
			reviewCount: 2
		});
		expect(jsonLd.review).toHaveLength(2);
	});

	it('omits rating, reviews and placeholder images when absent', () => {
		const jsonLd = buildProductJsonLd({
			...base,
			rating: null,
			reviewsCount: 0,
			reviews: [],
			coverImage: null,
			images: [{ url: '/placeholder.svg', alt: 'Sin imagen' }]
		});
		expect(jsonLd.aggregateRating).toBeUndefined();
		expect(jsonLd.review).toBeUndefined();
		expect(jsonLd.image).toBeUndefined();
	});

	it('omits offers when no variant has a price', () => {
		const jsonLd = buildProductJsonLd({
			...base,
			variants: [{ ...base.variants[0], priceInCents: null }]
		});
		expect(jsonLd.offers).toBeUndefined();
	});
});
