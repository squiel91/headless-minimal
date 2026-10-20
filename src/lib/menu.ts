import type { MenuItem } from '#lib/tiendu';

// Menu urls follow the store theme routes. The template uses the same
// /productos, /categorias, /paginas and /blog prefixes, so resource links
// map 1:1. Custom links pass through untouched (relative site paths and
// absolute external urls alike).
const PREFIXES = ['/productos/', '/categorias/', '/paginas/', '/blog/'];

export function toSiteUrl(item: MenuItem): string {
	if (!item.resourceType) return item.url;
	for (const prefix of PREFIXES) {
		if (item.url.startsWith(prefix)) return item.url;
	}
	return item.url;
}

export function linkAttrs(item: MenuItem): { target?: string; rel?: string } {
	return item.openInNewTab ? { target: '_blank', rel: 'noopener' } : {};
}
