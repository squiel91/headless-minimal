import type { RequestHandler } from './$types';
import { getAllProducts } from '#lib/store';

export const GET: RequestHandler = async ({ fetch, url }) => {
	const page = Number(url.searchParams.get('page') ?? 1) || 1;
	return Response.json(await getAllProducts(fetch, page));
};
