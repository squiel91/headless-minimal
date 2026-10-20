// Editorial copy for the homepage and shared sections.
//
// Everything a shopper reads that does NOT come from the store's data lives
// here. The template ships with copy for a fictional home-and-objects store:
// replace it to match the real store (tone, products, promises) before launch.
// Store name, products, collections and posts always come from the Store API.
//
// Links must point to routes that exist (/productos, /categorias/<handle>,
// /paginas/<handle>, /blog). Never invent a /paginas/<handle> the store lacks.
// New stores are seeded with three policy pages, linked below:
// politicas-de-envio, politicas-de-cambios-y-devoluciones, politicas-de-privacidad.

export const content = {
	hero: {
		eyebrow: 'Objetos para la casa',
		title: 'Menos cosas, mejor elegidas.',
		text: 'Piezas simples y duraderas para cada ambiente. Elegidas una por una, pensadas para usarse todos los días.',
		primary: { label: 'Ver productos', href: '/productos' },
		secondary: { label: 'Explorar categorías', href: '#categorias' }
	},

	featured: {
		eyebrow: 'Selección',
		// Collection handle to feature, ideally one with 4+ products. null (or an
		// empty collection) shows best sellers under fallbackTitle.
		collectionHandle: null as string | null,
		fallbackTitle: 'Más vendidos',
		linkLabel: 'Ver todo'
	},

	split: {
		eyebrow: 'Cómo elegimos',
		title: 'Hechos para durar, no para una temporada.',
		text: 'Trabajamos con talleres chicos y materiales nobles: cerámica, lino y madera maciza. Si no lo usaríamos en nuestra casa, no lo vendemos.',
		link: { label: 'Ver la colección', href: '/productos' },
		image: {
			url: 'https://imagedelivery.net/HiGIiqXkjW_RLEpaG3HXUg/3dcd0c43-db00-4f51-7c6f-77e2ca56ba00/lg',
			alt: 'Jarrón de gres con una rama seca y un cuenco oscuro sobre una mesa de roble'
		}
	},

	collections: {
		eyebrow: 'Categorías',
		title: 'Explorá por ambiente'
	},

	benefits: [
		{
			title: 'Envíos a todo el país',
			text: 'Recibí tu pedido en 24 a 72 horas hábiles.',
			href: '/paginas/politicas-de-envio'
		},
		{
			title: 'Cambios sin vueltas',
			text: 'Tenés 30 días para cambiar o devolver tu compra.',
			href: '/paginas/politicas-de-cambios-y-devoluciones'
		},
		{ title: 'Pagá como quieras', text: 'Tarjetas, transferencia o Mercado Pago.' }
	],

	product: {
		// Short promises under the add-to-cart button. Reuses the homepage
		// benefits so they stay in sync; replace with a custom list if needed.
		showBenefits: true,
		related: { eyebrow: 'Relacionados', title: 'También te puede gustar' }
	},

	blog: {
		eyebrow: 'Diario',
		title: 'Ideas para la casa',
		linkLabel: 'Ver todos'
	},

	newsletter: {
		title: 'Novedades, sin ruido.',
		text: 'Un correo por mes con piezas nuevas y reposiciones. Nada más.',
		success: '¡Gracias por suscribirte! Revisá tu correo.',
		privacy: { label: 'Política de privacidad', href: '/paginas/politicas-de-privacidad' }
	},

	whatsapp: {
		label: 'Escribinos por WhatsApp',
		message: 'Hola, tengo una consulta.'
	}
};
