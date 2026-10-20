import type { RequestHandler } from './$types';
import { query } from '#lib/store';

interface Connection {
	totalCount: number;
	nodes: { handle: string }[];
}

async function allHandles(
	fetchFn: typeof fetch,
	root: 'products' | 'collections' | 'pages' | 'blogPosts'
): Promise<string[]> {
	const handles: string[] = [];
	let page = 1;
	for (;;) {
		const data = await query<Record<string, Connection>>(
			`query($page: Int) { ${root}(first: 100, page: $page) { totalCount nodes { handle } } }`,
			{ page },
			fetchFn
		);
		const connection = data[root];
		for (const node of connection.nodes) handles.push(node.handle);
		if (handles.length >= connection.totalCount || connection.nodes.length === 0) break;
		page += 1;
		if (page > 50) break;
	}
	return handles;
}

function escapeXml(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
}

export const GET: RequestHandler = async ({ fetch, url }) => {
	const [products, collections, pages, posts] = await Promise.all([
		allHandles(fetch, 'products'),
		allHandles(fetch, 'collections'),
		allHandles(fetch, 'pages'),
		allHandles(fetch, 'blogPosts')
	]);
	const paths = [
		'/',
		'/categorias/todas',
		'/blog',
		...collections.map((handle) => `/categorias/${handle}`),
		...products.map((handle) => `/productos/${handle}`),
		...pages.map((handle) => `/paginas/${handle}`),
		...posts.map((handle) => `/blog/${handle}`)
	];
	const xml =
		`<?xml version="1.0" encoding="UTF-8"?>\n` +
		`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
		paths.map((path) => `  <url><loc>${escapeXml(url.origin + path)}</loc></url>`).join('\n') +
		`\n</urlset>\n`;
	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
			'Cache-Control': 'public, max-age=3600'
		}
	});
};
