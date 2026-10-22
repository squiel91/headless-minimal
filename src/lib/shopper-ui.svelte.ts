// Browser-owned account and favorites state, shared by the header and product buttons.
export interface Shopper {
	id: number;
	email: string;
	name: string;
	surname: string;
	phone: string | null;
}

export const shopperUi = $state({
	shopper: null as Shopper | null,
	wishlistProductIds: [] as number[],
	pendingProductIds: [] as string[],
	opening: null as 'account' | 'wishlist' | null
});
