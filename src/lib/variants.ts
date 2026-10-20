// Pure variant-selection helpers for the product page. Framework-free so they
// are unit-testable (see variants.test.ts) and reusable by any component.
import type { Image, Variant } from '#lib/tiendu';

export type Selection = Record<string, string | undefined>;

/** Variants matching the selection so far, optionally ignoring one option. */
export function matchingVariants(
	variants: Variant[],
	selected: Selection,
	ignoreOption?: string
): Variant[] {
	return variants.filter((v) =>
		(v.selectedOptions ?? []).every((s) => {
			if (s.name === ignoreOption) return true;
			const sel = selected[s.name];
			return sel === undefined || sel === '' || sel === s.value;
		})
	);
}

/** Whether picking a value still matches at least one variant. */
export function isValueAvailable(
	variants: Variant[],
	selected: Selection,
	optionName: string,
	value: string
): boolean {
	return matchingVariants(variants, { ...selected, [optionName]: value }).length > 0;
}

/**
 * Drop selections that are no longer compatible with the other choices.
 * Removing a selection only widens the compatible sets, so repeated
 * application converges.
 */
export function pruneSelection(
	variants: Variant[],
	selected: Selection,
	optionNames: string[]
): Selection {
	// Returns the same reference when nothing was pruned, so reactive
	// consumers (e.g. a $effect assigning its result) settle instead of
	// re-running forever.
	let pruned: Selection | null = null;
	for (const name of optionNames) {
		const current = pruned ?? selected;
		const sel = current[name];
		if (sel === undefined || sel === '') continue;
		const rest: Selection = { ...current, [name]: undefined };
		if (!isValueAvailable(variants, rest, name, sel)) {
			pruned = pruned ?? { ...selected };
			pruned[name] = undefined;
		}
	}
	return pruned ?? selected;
}

/** Lowest non-null price among variants, if any. */
export function minPriceOf(variants: Variant[]): number | null {
	const prices = variants.map((v) => v.priceInCents).filter((p): p is number => p != null);
	return prices.length ? Math.min(...prices) : null;
}

/** Product images followed by variant images, deduplicated by URL. */
export function galleryImages(images: Image[], variants: Variant[]): Image[] {
	const seen = new Set<string>();
	const out: Image[] = [];
	for (const image of [...images, ...variants.flatMap((v) => (v.image ? [v.image] : []))]) {
		if (!seen.has(image.url)) {
			seen.add(image.url);
			out.push(image);
		}
	}
	return out;
}

/**
 * The image every variant shares, or null when they differ or one has none.
 * Lets the gallery follow a partial selection (e.g. a color before a size).
 */
export function commonImage(variants: Variant[]): Image | null {
	const first = variants[0]?.image;
	if (!first) return null;
	return variants.every((v) => v.image?.url === first.url) ? first : null;
}

/** Stock agreement across variants. `null` stock means unlimited. */
export function commonStock(variants: Variant[]): { unanimous: boolean; stock: number | null } {
	if (!variants.length) return { unanimous: false, stock: null };
	const first = variants[0].stock;
	const same = variants.every((v) => v.stock === first);
	return { unanimous: same, stock: same ? first : null };
}

/** The price when every variant agrees on one non-null value, otherwise undefined. */
export function uniformPrice(variants: Variant[]): number | undefined {
	const distinct = [...new Set(variants.map((v) => v.priceInCents))];
	return variants.length > 0 && distinct.length === 1 && distinct[0] != null
		? distinct[0]
		: undefined;
}

/**
 * The compare-at price when every variant agrees on one non-null value,
 * otherwise undefined.
 */
export function commonCompareAt(variants: Variant[]): number | undefined {
	const distinct = [...new Set(variants.map((v) => v.compareAtPriceInCents))];
	return distinct.length === 1 && distinct[0] != null ? distinct[0] : undefined;
}
