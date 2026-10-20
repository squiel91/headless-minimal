import type { PageServerLoad } from './$types';
import { content } from '#lib/content';
import { getBlogPosts, getCollectionPreview, getHome } from '#lib/store';

export const load: PageServerLoad = async ({ fetch }) => {
	const handle = content.featured.collectionHandle;
	const [home, blog, preview] = await Promise.all([
		getHome(fetch),
		getBlogPosts(fetch, 1),
		handle ? getCollectionPreview(fetch, handle) : null
	]);

	// The configured collection when it has products, otherwise best sellers.
	const featured = preview?.products.length
		? { title: preview.name, href: `/categorias/${preview.handle}`, products: preview.products }
		: { title: content.featured.fallbackTitle, href: '/productos', products: home.products.slice(0, 4) };

	return { collections: home.collections, featured, posts: blog.nodes.slice(0, 4) };
};
