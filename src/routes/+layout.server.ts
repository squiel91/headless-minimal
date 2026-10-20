import type { LayoutServerLoad } from './$types';
import { getFooter, getMenu, getStore } from '#lib/store';

export const load: LayoutServerLoad = async ({ fetch }) => {
	const [store, footer, mainMenu, infoMenu] = await Promise.all([
		getStore(fetch),
		getFooter(fetch),
		getMenu(fetch, 'principal'),
		getMenu(fetch, 'footer')
	]);
	return { store, ...footer, mainMenu, infoMenu };
};
