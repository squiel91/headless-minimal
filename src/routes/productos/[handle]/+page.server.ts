import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getProduct } from '#lib/store';

export const load: PageServerLoad = async ({ fetch, params }) => {
	const product = await getProduct(fetch, params.handle);
	if (!product) throw error(404, 'Producto no encontrado');
	return { product, handle: params.handle };
};
