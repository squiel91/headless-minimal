import type { StoreFont } from '#lib/tiendu';

const FALLBACK_STACK = 'ui-sans-serif, system-ui, sans-serif';

/** CSS font-family value from the store font, with a system fallback. */
export function buildFontFamily(font: StoreFont | null): string {
	if (!font) return FALLBACK_STACK;
	const family = font.family.replace(/"/g, '');
	const fallback = font.fallbackFamilies || 'sans-serif';
	return `"${family}", ${fallback}`;
}

/** @font-face rules for the store font variants that carry a file URL. */
export function buildFontFaceCss(font: StoreFont | null): string {
	if (!font) return '';
	const family = font.family.replace(/"/g, '');
	const rules: string[] = [];
	for (const variant of font.variants ?? []) {
		if (!variant.url) continue;
		const src = variant.format
			? `url("${variant.url}") format("${variant.format}")`
			: `url("${variant.url}")`;
		rules.push(
			`@font-face{font-family:"${family}";font-style:${variant.style};font-weight:${variant.weight};font-display:swap;src:${src};}`
		);
	}
	return rules.join('');
}
