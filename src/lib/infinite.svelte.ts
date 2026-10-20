/**
 * Infinite product list: renders the server-loaded first page and appends
 * following pages through a JSON endpoint as the sentinel scrolls into view.
 * Page count and totals are never queried; only `hasNextPage` drives it.
 */
export interface InfinitePage<T> {
	nodes: T[];
	hasMore: boolean;
}

export class InfiniteList<T> {
	items = $state<T[]>([]);
	hasMore = $state(true);
	loading = $state(false);

	#page: number;
	#load: (page: number) => Promise<InfinitePage<T>>;

	constructor(
		initial: T[],
		startPage: number,
		hasMore: boolean,
		load: (page: number) => Promise<InfinitePage<T>>
	) {
		this.items = [...initial];
		this.#page = startPage;
		this.hasMore = hasMore;
		this.#load = load;
	}

	async more(): Promise<void> {
		if (this.loading || !this.hasMore) return;
		this.loading = true;
		try {
			this.#page += 1;
			const next = await this.#load(this.#page);
			this.items.push(...next.nodes);
			this.hasMore = next.hasMore;
		} catch {
			this.#page -= 1;
			this.hasMore = false;
		} finally {
			this.loading = false;
		}
	}

	observe = (node: HTMLElement): { destroy: () => void } => {
		if (typeof IntersectionObserver === 'undefined') {
			void this.more();
			return { destroy: () => {} };
		}
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries.some((entry) => entry.isIntersecting)) void this.more();
			},
			{ rootMargin: '400px' }
		);
		observer.observe(node);
		return {
			destroy: () => observer.disconnect()
		};
	};
}
