import type { PageServerLoad } from './$types';
import { searchProducts } from '#lib/store';

export const load: PageServerLoad = async ({ fetch, url }) => {
	const q = (url.searchParams.get('q') ?? '').trim();
	const page = Number(url.searchParams.get('page') ?? 1) || 1;
	if (!q) return { q, page, results: null };
	return { q, page, results: await searchProducts(fetch, q, page) };
};
