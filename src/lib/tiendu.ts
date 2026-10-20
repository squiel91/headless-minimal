// Shared Store API shapes (subset of the public GraphQL schema).
export interface Image {
	url: string;
	alt: string;
}

export interface Seo {
	title: string | null;
	description: string | null;
}

export interface ProductReview {
	rating: number;
	content: string;
	authorName: string;
	verifiedPurchase: boolean;
	images: Image[];
	// Not exposed by the Store API Review type yet; renders when present.
	createdAt?: string | null;
}

export interface ProductListItem {
	handle: string;
	title: string;
	currency: string;
	priceMinInCents: number | null;
	priceMaxInCents: number | null;
	compareAtPriceInCents: number | null;
	available: boolean;
	coverImage: Image | null;
	rating: number | null;
	reviewsCount: number;
}

export interface SelectedOption {
	name: string;
	value: string;
}

export interface Variant {
	id: string;
	image: Image | null;
	sku: string | null;
	priceInCents: number | null;
	compareAtPriceInCents: number | null;
	stock: number | null;
	available: boolean;
	selectedOptions: SelectedOption[];
}

export interface OptionValue {
	value: string;
	color: string | null;
	image: Image | null;
}

export interface ProductOption {
	name: string;
	displayType: string;
	values: OptionValue[];
}

export interface Specification {
	name: string;
	value: string;
}

export interface ProductDetail {
	id: string;
	title: string;
	description: string | null;
	currency: string;
	priceMinInCents: number | null;
	priceMaxInCents: number | null;
	available: boolean;
	coverImage: Image | null;
	images: Image[];
	videoUrl: string | null;
	options: ProductOption[];
	variants: Variant[];
	specifications: Specification[];
	related: ProductListItem[];
	seo: Seo;
	rating: number | null;
	reviewsCount: number;
	reviews: ProductReview[];
}

export interface ProductPageInfo {
	currentPage: number;
	hasNextPage: boolean;
	hasPreviousPage: boolean;
}

export interface ProductConnection {
	pageInfo: ProductPageInfo;
	nodes: ProductListItem[];
}

export interface PageInfo {
	currentPage: number;
	totalPages: number;
	hasNextPage: boolean;
	hasPreviousPage: boolean;
}

export interface SortOption {
	value: string;
	label: string;
}

export interface CollectionDetail {
	name: string;
	description: string | null;
	coverImage: Image | null;
	productCount: number;
	parent: { handle: string; name: string } | null;
	children: { handle: string; name: string }[];
	defaultSortBy: string;
	sortOptions: SortOption[];
	seo: Seo;
	products: ProductConnection;
}

export interface PageListItem {
	handle: string;
	title: string;
}

export interface StaticPage {
	handle: string;
	title: string | null;
	html: string;
	seo: Seo;
}

export interface BlogPostListItem {
	handle: string;
	title: string;
	excerpt: string | null;
	coverImage: Image | null;
	publishedAt: string | null;
}

export interface BlogPostDetail extends BlogPostListItem {
	html: string;
	seo: Seo;
}

export interface CollectionListItem {
	handle: string;
	name: string;
	coverImage: Image | null;
}

export interface MenuItem {
	label: string;
	url: string;
	openInNewTab: boolean;
	resourceType: string | null;
}

export interface StoreMenu {
	handle: string;
	title: string;
	items: MenuItem[];
}

export interface StoreFontVariant {
	weight: number;
	style: string;
	url: string | null;
	format: string | null;
}

export interface StoreFont {
	family: string;
	fallbackFamilies: string;
	variants: StoreFontVariant[];
}

export interface StoreInfo {
	name: string;
	description: string | null;
	currency: string;
	whatsappNumber: string | null;
	emailAddress: string | null;
	personalization: {
		primaryColor: string;
		primaryButtonTextColor: string;
		rounding: string;
		font: StoreFont | null;
	} | null;
}
