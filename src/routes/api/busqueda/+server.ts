import type { RequestHandler } from './$types';
import { searchProducts } from '#lib/store';

export const GET: RequestHandler = async ({ fetch, url }) => {
	const q = (url.searchParams.get('q') ?? '').trim();
	const page = Number(url.searchParams.get('page') ?? 1) || 1;
	if (!q) return Response.json({ nodes: [], pageInfo: { currentPage: page, hasNextPage: false, hasPreviousPage: page > 1 } });
	return Response.json(await searchProducts(fetch, q, page));
};
