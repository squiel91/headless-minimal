import { describe, expect, it } from 'vitest';
import {
	commonCompareAt,
	commonImage,
	commonStock,
	galleryImages,
	isValueAvailable,
	uniformPrice,
	matchingVariants,
	minPriceOf,
	pruneSelection,
	type Selection
} from '#lib/variants';
import type { Variant } from '#lib/tiendu';

const variant = (
	id: string,
	options: [string, string][],
	priceInCents: number | null,
	compareAtPriceInCents: number | null = null,
	stock: number | null = 10
): Variant => ({
	id,
	image: null,
	sku: null,
	stock,
	priceInCents,
	compareAtPriceInCents,
	available: true,
	selectedOptions: options.map(([name, value]) => ({ name, value }))
});

const variants = [
	variant('1', [['Color', 'Blanco'], ['Tamaño', 'Chico']], 18900, 22000),
	variant('2', [['Color', 'Blanco'], ['Tamaño', 'Grande']], 19900, 22000),
	variant('3', [['Color', 'Gris'], ['Tamaño', 'Chico']], 18900, null)
];

describe('matchingVariants', () => {
	it('matches everything with an empty selection', () => {
		expect(matchingVariants(variants, {})).toHaveLength(3);
	});

	it('narrows as options are selected', () => {
		const selected: Selection = { Color: 'Blanco' };
		expect(matchingVariants(variants, selected).map((v) => v.id)).toEqual(['1', '2']);
	});

	it('finds the single chosen variant on a full selection', () => {
		const selected: Selection = { Color: 'Gris', Tamaño: 'Chico' };
		expect(matchingVariants(variants, selected).map((v) => v.id)).toEqual(['3']);
	});
});

describe('isValueAvailable', () => {
	it('allows everything with an empty selection', () => {
		expect(isValueAvailable(variants, {}, 'Color', 'Blanco')).toBe(true);
		expect(isValueAvailable(variants, {}, 'Color', 'Gris')).toBe(true);
	});

	it('rejects values with no matching combination left', () => {
		expect(isValueAvailable(variants, { Tamaño: 'Grande' }, 'Color', 'Blanco')).toBe(true);
		expect(isValueAvailable(variants, { Tamaño: 'Grande' }, 'Color', 'Gris')).toBe(false);
		expect(isValueAvailable(variants, { Color: 'Gris' }, 'Tamaño', 'Grande')).toBe(false);
	});
});

describe('pruneSelection', () => {
	it('returns the same reference when nothing was pruned', () => {
		const selected: Selection = { Color: 'Blanco' };
		expect(pruneSelection(variants, selected, ['Color', 'Tamaño'])).toBe(selected);
	});

	it('drops selections that no longer match', () => {
		expect(
			pruneSelection(variants, { Color: 'Gris', Tamaño: 'Grande' }, ['Color', 'Tamaño'])
		).toEqual({ Color: undefined, Tamaño: 'Grande'});
	});
});

describe('galleryImages', () => {
	const img = (url: string) => ({ url, alt: url });
	it('concatenates product and variant images without duplicates', () => {
		const withImages = [
			{ ...variant('1', [], 100, null), image: img('v1') },
			{ ...variant('2', [], 100, null), image: img('v1') },
			{ ...variant('3', [], 100, null), image: null }
		];
		expect(galleryImages([img('p1'), img('v1')], withImages).map((i) => i.url)).toEqual([
			'p1',
			'v1'
		]);
	});
});

describe('commonImage', () => {
	const withImage = (v: Variant, url: string | null): Variant => ({
		...v,
		image: url ? { url, alt: '' } : null
	});
	const imaged = [
		withImage(variants[0], '/blanco.jpg'),
		withImage(variants[1], '/blanco.jpg'),
		withImage(variants[2], '/gris.jpg')
	];

	it('returns the image shared by a partial selection', () => {
		expect(commonImage(matchingVariants(imaged, { Color: 'Blanco' }))?.url).toBe('/blanco.jpg');
	});

	it('returns null when the matching variants differ', () => {
		expect(commonImage(imaged)).toBeNull();
	});

	it('returns null when a variant has no image', () => {
		expect(commonImage([imaged[0], withImage(variants[1], null)])).toBeNull();
	});
});

describe('commonStock', () => {
	it('reports unanimous stock, including unlimited', () => {
		expect(commonStock([variant('1', [], 100), variant('2', [], 100)])).toEqual({
			unanimous: true,
			stock: 10
		});
		expect(commonStock([variant('1', [], 100, null, null)])).toEqual({
			unanimous: true,
			stock: null
		});
	});

	it('reports disagreement and emptiness', () => {
		expect(
			commonStock([variant('1', [], 100, null, 3), variant('2', [], 100, null, 5)])
				.unanimous
		).toBe(false);
		expect(commonStock([])).toEqual({ unanimous: false, stock: null });
	});
});

describe('pricing', () => {
	it('returns the single price when all filtered variants agree', () => {
		expect(uniformPrice(matchingVariants(variants, { Color: 'Gris' }))).toBe(18900);
		expect(uniformPrice(matchingVariants(variants, { Color: 'Blanco' }))).toBeUndefined();
		expect(uniformPrice([])).toBeUndefined();
	});

	it('takes the minimum over the filtered variants', () => {
		expect(minPriceOf(matchingVariants(variants, { Color: 'Blanco' }))).toBe(18900);
		expect(minPriceOf([])).toBeNull();
	});

	it('shows compare-at only on unanimous non-null values', () => {
		expect(commonCompareAt(matchingVariants(variants, { Color: 'Blanco' }))).toBe(22000);
		expect(commonCompareAt(variants)).toBeUndefined();
		expect(commonCompareAt([])).toBeUndefined();
	});
});
