import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getStaticPage } from '#lib/store';

export const load: PageServerLoad = async ({ fetch, params }) => {
	const page = await getStaticPage(fetch, params.handle);
	if (!page) throw error(404, 'Página no encontrada');
	return { page };
};
