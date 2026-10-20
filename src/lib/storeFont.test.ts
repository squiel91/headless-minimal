import { describe, expect, it } from 'vitest';
import { buildFontFaceCss, buildFontFamily } from '#lib/storeFont';
import type { StoreFont } from '#lib/tiendu';

const font: StoreFont = {
	family: 'Google Sans',
	fallbackFamilies: 'sans-serif',
	variants: [
		{ weight: 400, style: 'normal', url: 'https://cdn.test/400.woff2', format: 'woff2' },
		{ weight: 700, style: 'normal', url: 'https://cdn.test/700.woff2', format: null },
		{ weight: 400, style: 'italic', url: null, format: null }
	]
};

describe('buildFontFamily', () => {
	it('quotes the family and appends the fallback', () => {
		expect(buildFontFamily(font)).toBe('"Google Sans", sans-serif');
	});

	it('falls back to the system stack without a font', () => {
		expect(buildFontFamily(null)).toContain('system-ui');
	});
});

describe('buildFontFaceCss', () => {
	it('emits a rule per variant with a URL', () => {
		const css = buildFontFaceCss(font);
		expect(css).toContain('font-weight:400');
		expect(css).toContain('font-weight:700');
		expect(css).toContain('format("woff2")');
		expect(css.match(/@font-face/g)).toHaveLength(2);
	});

	it('returns empty without a font', () => {
		expect(buildFontFaceCss(null)).toBe('');
	});
});
