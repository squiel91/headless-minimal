import { describe, expect, it, vi } from 'vitest';
import { InfiniteList } from '#lib/infinite.svelte';

describe('InfiniteList', () => {
	it('appends pages while more remain', async () => {
		const load = vi.fn(async (page: number) => ({
			nodes: [`p${page}a`, `p${page}b`],
			hasMore: page < 3
		}));
		const list = new InfiniteList(['p1'], 1, true, load);
		expect(list.items).toEqual(['p1']);

		await list.more();
		expect(list.items).toEqual(['p1', 'p2a', 'p2b']);
		expect(list.hasMore).toBe(true);

		await list.more();
		expect(list.items).toHaveLength(5);
		expect(list.hasMore).toBe(false);
		expect(load).toHaveBeenCalledTimes(2);
	});

	it('stops when there is nothing more and on errors', async () => {
		const list = new InfiniteList(['p1'], 1, false, async () => ({
			nodes: ['x'],
			hasMore: true
		}));
		await list.more();
		expect(list.items).toEqual(['p1']);

		const failing = new InfiniteList(['p1'], 1, true, async () => {
			throw new Error('offline');
		});
		await failing.more();
		expect(failing.items).toEqual(['p1']);
		expect(failing.hasMore).toBe(false);
		expect(failing.loading).toBe(false);
	});
});
