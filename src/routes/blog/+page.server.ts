import type { PageServerLoad } from './$types';
import { getBlogPosts } from '#lib/store';

export const load: PageServerLoad = async ({ fetch, url }) => {
	const page = Number(url.searchParams.get('page') ?? 1) || 1;
	return { page, ...(await getBlogPosts(fetch, page)) };
};
