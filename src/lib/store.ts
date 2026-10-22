// Server-only Store API client. Catalog and content are public and the same
// for every visitor, so pages call these from server load() and SvelteKit
// renders them into HTML. No session, no key, no allowed origin needed.
import { STORE_HANDLE, STORE_ORIGIN } from '$app/env/private';
import type {
	BlogPostDetail,
	BlogPostListItem,
	CollectionDetail,
	CollectionListItem,
	PageInfo,
	PageListItem,
	StaticPage,
	ProductConnection,
	ProductDetail,
	ProductListItem,
	ProductReview,
	StoreInfo,
	StoreMenu
} from '#lib/tiendu';

function endpoint(): string {
	return `${STORE_ORIGIN}/${STORE_HANDLE}/api/graphql`;
}

interface GraphQLError {
	message: string;
}

interface GraphQLResponse<T> {
	data?: T;
	errors?: GraphQLError[];
}

export async function query<T>(
	q: string,
	variables: Record<string, unknown> | undefined,
	fetchFn: typeof fetch = fetch
): Promise<T> {
	const res = await fetchFn(endpoint(), {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ query: q, variables })
	});
	if (!res.ok) throw new Error(`Store API responded ${res.status}`);
	const { data, errors } = (await res.json()) as GraphQLResponse<T>;
	if (errors?.length) throw new Error(errors[0].message);
	if (!data) throw new Error('Store API returned no data');
	return data;
}

export async function getStore(fetchFn: typeof fetch): Promise<StoreInfo> {
	const { store } = await query<{ store: StoreInfo }>(
		`{ store { name description currency whatsappNumber emailAddress personalization { primaryColor primaryButtonTextColor rounding font { family fallbackFamilies variants { weight style url format } } } } }`,
		undefined,
		fetchFn
	);
	return store;
}

export async function getFooter(fetchFn: typeof fetch): Promise<{
	collections: CollectionListItem[];
	pages: PageListItem[];
}> {
	const data = await query<{
		collections: { nodes: CollectionListItem[] };
		pages: { nodes: PageListItem[] };
	}>(
		`{
			collections(first: 50) { nodes { handle name } }
			pages(first: 50) { nodes { handle title } }
		}`,
		undefined,
		fetchFn
	);
	return { collections: data.collections.nodes, pages: data.pages.nodes };
}

export async function getMenu(
	fetchFn: typeof fetch,
	handle: string
): Promise<StoreMenu | null> {
	const { menu } = await query<{ menu: StoreMenu | null }>(
		`query($h: String!) {
			menu(handle: $h) { handle title items { label url openInNewTab resourceType } }
		}`,
		{ h: handle },
		fetchFn
	);
	return menu;
}

export async function getHome(fetchFn: typeof fetch): Promise<{
	collections: CollectionListItem[];
	products: ProductListItem[];
}> {
	const { collections, products } = await query<{
		collections: { nodes: CollectionListItem[] };
		products: { nodes: ProductListItem[] };
	}>(
		`{
			collections(roots: true) { nodes { handle name coverImage { url alt } } }
			products(first: 8, sortBy: "best-selling") {
				nodes { id handle title currency priceMinInCents priceMaxInCents compareAtPriceInCents available coverImage { url alt } rating reviewsCount }
			}
		}`,
		undefined,
		fetchFn
	);
	return { collections: collections.nodes, products: products.nodes };
}

export interface CollectionPreview {
	handle: string;
	name: string;
	products: ProductListItem[];
}

/** A collection's name and first products, for homepage sections. */
export async function getCollectionPreview(
	fetchFn: typeof fetch,
	handle: string,
	first = 4
): Promise<CollectionPreview | null> {
	const { collection } = await query<{
		collection: { handle: string; name: string; products: { nodes: ProductListItem[] } } | null;
	}>(
		`query($h: String, $first: Int) {
			collection(handle: $h) {
				handle name
				products(first: $first) {
					nodes { id handle title currency priceMinInCents priceMaxInCents compareAtPriceInCents available coverImage { url alt } rating reviewsCount }
				}
			}
		}`,
		{ h: handle, first },
		fetchFn
	);
	if (!collection) return null;
	return { handle: collection.handle, name: collection.name, products: collection.products.nodes };
}

export async function getCollection(
	fetchFn: typeof fetch,
	handle: string,
	page = 1,
	sortBy?: string
): Promise<CollectionDetail | null> {
	const { collection } = await query<{ collection: CollectionDetail | null }>(
		`query($h: String, $page: Int, $sort: ProductSort) {
			collection(handle: $h) {
				name description coverImage { url alt } productCount
				parent { handle name }
				children { handle name }
				defaultSortBy sortOptions { value label }
				seo { title description }
				products(first: 24, page: $page, sortBy: $sort) {
					pageInfo { currentPage hasNextPage hasPreviousPage }
					nodes { id handle title currency priceMinInCents priceMaxInCents compareAtPriceInCents available coverImage { url alt } rating reviewsCount }
				}
			}
		}`,
		{ h: handle, page, sort: sortBy ?? null },
		fetchFn
	);
	return collection;
}

interface ProductDetailResponse extends Omit<ProductDetail, 'reviews'> {
	reviews: { totalCount: number; nodes: ProductReview[] };
}

export async function getProduct(
	fetchFn: typeof fetch,
	handle: string
): Promise<ProductDetail | null> {
	const { product } = await query<{ product: ProductDetailResponse | null }>(
		`query($h: String) {
			product(handle: $h) {
				id title description currency
				priceMinInCents priceMaxInCents
				available coverImage { url alt } images { url alt } videoUrl
				options { name displayType values { value color image { url alt } } }
				variants { id image { url alt } sku priceInCents compareAtPriceInCents stock available selectedOptions { name value } }
				specifications { name value }
				related(first: 4) { id handle title currency priceMinInCents priceMaxInCents compareAtPriceInCents available coverImage { url alt } rating reviewsCount }
				seo { title description }
				rating reviewsCount
				reviews(first: 10) { totalCount nodes { rating content authorName verifiedPurchase createdAt images { url alt } } }
			}
		}`,
		{ h: handle },
		fetchFn
	);
	if (!product) return null;
	return { ...product, reviews: product.reviews.nodes };
}

export async function getStaticPage(
	fetchFn: typeof fetch,
	handle: string
): Promise<StaticPage | null> {
	const { page } = await query<{ page: StaticPage | null }>(
		`query($h: String!) {
			page(handle: $h) { handle title html seo { title description } }
		}`,
		{ h: handle },
		fetchFn
	);
	return page;
}

export async function getBlogPosts(
	fetchFn: typeof fetch,
	page = 1
): Promise<{ nodes: BlogPostListItem[]; totalCount: number; pageInfo: PageInfo }> {
	const { blogPosts } = await query<{
		blogPosts: { nodes: BlogPostListItem[]; totalCount: number; pageInfo: PageInfo };
	}>(
		`query($page: Int) {
			blogPosts(first: 12, page: $page) {
				totalCount
				pageInfo { currentPage totalPages hasNextPage hasPreviousPage }
				nodes { handle title excerpt coverImage { url alt } publishedAt }
			}
		}`,
		{ page },
		fetchFn
	);
	return blogPosts;
}

export async function getBlogPost(
	fetchFn: typeof fetch,
	handle: string
): Promise<BlogPostDetail | null> {
	const { blogPost } = await query<{ blogPost: BlogPostDetail | null }>(
		`query($h: String!) {
			blogPost(handle: $h) {
				handle title excerpt coverImage { url alt } publishedAt
				html seo { title description }
			}
		}`,
		{ h: handle },
		fetchFn
	);
	return blogPost;
}

export async function searchProducts(
	fetchFn: typeof fetch,
	q: string,
	page = 1
): Promise<ProductConnection> {
	const { products } = await query<{ products: ProductConnection }>(
		`query($q: String, $page: Int) {
			products(query: $q, first: 24, page: $page) {
				pageInfo { currentPage hasNextPage hasPreviousPage }
				nodes { id handle title currency priceMinInCents priceMaxInCents compareAtPriceInCents available coverImage { url alt } rating reviewsCount }
			}
		}`,
		{ q, page },
		fetchFn
	);
	return products;
}
