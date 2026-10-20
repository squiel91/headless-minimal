import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getBlogPost, getBlogPosts } from '#lib/store';

export const load: PageServerLoad = async ({ fetch, params }) => {
	const [post, latest] = await Promise.all([
		getBlogPost(fetch, params.handle),
		getBlogPosts(fetch, 1)
	]);
	if (!post) throw error(404, 'Artículo no encontrado');
	const more = latest.nodes.filter((p) => p.handle !== post.handle).slice(0, 3);
	return { post, more };
};
