// Browser-only shopper client. The Store SDK keeps the session token,
// powers the cart badge and add-to-cart, opens the checkout overlay and
// records analytics. Never import this from load(); call it from event
// handlers and onMount only.
import {
	PUBLIC_STORE_HANDLE as STORE_HANDLE,
	PUBLIC_STORE_ORIGIN as STORE_ORIGIN
} from '$app/env/public';
import { checkoutUi } from '#lib/checkout-ui.svelte';
import { shopperUi, type Shopper } from '#lib/shopper-ui.svelte';
import type { Variant } from '#lib/tiendu';

interface CartVariant {
	id: string;
	priceInCents: number | null;
}

interface CartProduct {
	title: string;
	currency: string;
	priceMinInCents: number | null | undefined;
}

interface SdkCartProduct {
	title: string;
	currency: string;
	basePriceInCents: number | null | undefined;
}

interface TienduClient {
	shopper: {
		getStatus(): Promise<{ shopper: Shopper | null; wishlistCount: number; wishlistProductIds: number[] }>;
		open(options?: { productId?: string }): Promise<unknown>;
	};
	wishlist: {
		open(): Promise<unknown>;
		toggle(productId: string): Promise<{ saved: boolean; count: number; productIds: number[] }>;
	};
	cart: {
		getQuantity(): Promise<{ quantity: number }>;
		add(variant: CartVariant, quantity: number, product: SdkCartProduct): Promise<unknown>;
	};
	checkout: {
		open(options?: { couponCode?: string }): Promise<unknown>;
	};
	search: {
		open(options?: { query?: string; suggestions?: string[] }): Promise<unknown>;
	};
	mutate(query: string, variables?: Record<string, unknown>): Promise<unknown>;
	track(event: string, data?: Record<string, unknown>): Promise<void>;
}

interface SubscriberCreateResponse {
	subscriberCreate: { userErrors: { message: string }[] };
}

declare global {
	interface Window {
		Tiendu?: (options: {
			storeHandle: string;
			origin: string;
			couponLinks?: { enabled?: boolean };
			session?: { persist?: boolean };
			analytics?: { pageViews?: boolean };
			search?: { suggestions?: string[] };
		}) => TienduClient;
	}
}

let clientPromise: Promise<TienduClient> | null = null;

function whenReady(): Promise<void> {
	if (window.Tiendu) return Promise.resolve();
	return new Promise((resolve, reject) => {
		const started = Date.now();
		const timer = setInterval(() => {
			if (window.Tiendu) {
				clearInterval(timer);
				resolve();
			} else if (Date.now() - started > 5000) {
				clearInterval(timer);
				reject(new Error('Store SDK failed to load'));
			}
		}, 50);
	});
}

export function getClient(): Promise<TienduClient> {
	if (typeof window === 'undefined')
		return Promise.reject(new Error('shopper client runs in the browser only'));
	if (!clientPromise) {
		// The SDK loads via <script src> in app.html and registers window.Tiendu.
		clientPromise = whenReady().then(() => {
			if (!window.Tiendu) throw new Error('Store SDK failed to load');
			return window.Tiendu({ storeHandle: STORE_HANDLE, origin: STORE_ORIGIN });
		});
	}
	return clientPromise;
}

export async function getQuantity(): Promise<{ quantity: number }> {
	return (await getClient()).cart.getQuantity();
}

export async function addToCart(
	product: CartProduct,
	variant: CartVariant,
	quantity = 1
): Promise<unknown> {
	const tiendu = await getClient();
	return tiendu.cart.add(
		{ id: variant.id, priceInCents: variant.priceInCents },
		quantity,
		{ title: product.title, currency: product.currency, basePriceInCents: product.priceMinInCents }
	);
}

export async function openSearch(query: string): Promise<unknown> {
	return (await getClient()).search.open({ query });
}

let shopperRequest = 0;

export async function refreshShopper(): Promise<void> {
	const request = ++shopperRequest;
	const status = await (await getClient()).shopper.getStatus();
	if (request !== shopperRequest) return;
	shopperUi.shopper = status.shopper;
	shopperUi.wishlistProductIds = status.wishlistProductIds;
}

export async function openShopperOverlay(overlay: 'account' | 'wishlist'): Promise<void> {
	if (shopperUi.opening) return;
	shopperUi.opening = overlay;
	try {
		const client = await getClient();
		if (overlay === 'account') await client.shopper.open();
		else await client.wishlist.open();
	} finally {
		shopperUi.opening = null;
	}
}

export async function toggleWishlist(productId: string): Promise<boolean | null> {
	const id = String(productId);
	if (shopperUi.pendingProductIds.includes(id)) return null;
	shopperUi.pendingProductIds.push(id);
	try {
		const client = await getClient();
		const { shopper } = await client.shopper.getStatus();
		if (!shopper) {
			await client.shopper.open({ productId: id });
			return null;
		}
		const { saved, productIds } = await client.wishlist.toggle(id);
		++shopperRequest; // Ignore reads started before this mutation completed.
		shopperUi.shopper = shopper;
		shopperUi.wishlistProductIds = productIds;
		return saved;
	} finally {
		shopperUi.pendingProductIds = shopperUi.pendingProductIds.filter((pending) => pending !== id);
	}
}

export async function openCheckout(): Promise<unknown> {
	checkoutUi.opening = true;
	try {
		return await (await getClient()).checkout.open();
	} finally {
		checkoutUi.opening = false;
	}
}

export async function subscribe(email: string): Promise<void> {
	const client = await getClient();
	const data = (await client.mutate(
		'mutation($email: String!) { subscriberCreate(email: $email) { userErrors { message } } }',
		{ email }
	)) as SubscriberCreateResponse;
	const errors = data?.subscriberCreate?.userErrors ?? [];
	if (errors.length > 0) throw new Error(errors[0].message);
}

export async function trackViewItem(
	product: CartProduct,
	variant: Variant | undefined
): Promise<void> {
	await (
		await getClient()
	).track('view_item', {
		product: {
			title: product.title,
			currency: product.currency,
			basePriceInCents: product.priceMinInCents
		},
		variant: variant
			? { id: variant.id, priceInCents: variant.priceInCents }
			: undefined
	});
}
