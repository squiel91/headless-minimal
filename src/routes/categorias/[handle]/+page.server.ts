import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getCollection } from '#lib/store';

export const load: PageServerLoad = async ({ fetch, params, url }) => {
	const page = Number(url.searchParams.get('page') ?? 1) || 1;
	const sort = url.searchParams.get('sort') ?? undefined;
	const collection = await getCollection(fetch, params.handle, page, sort);
	if (!collection) throw error(404, 'Categoría no encontrada');
	return { collection, page, sort: sort ?? collection.defaultSortBy, handle: params.handle };
};
