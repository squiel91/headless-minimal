import { describe, expect, it } from 'vitest';
import { formatRating, ratingFillPercent } from '#lib/rating';

describe('formatRating', () => {
	it('rounds to one decimal with a decimal comma', () => {
		expect(formatRating(4.67)).toBe('4,7');
		expect(formatRating(4.5)).toBe('4,5');
	});

	it('keeps whole numbers clean', () => {
		expect(formatRating(5)).toBe('5');
		expect(formatRating(4)).toBe('4');
	});
});

describe('ratingFillPercent', () => {
	it('maps the rating to a percentage of five stars', () => {
		expect(ratingFillPercent(4.5)).toBe(90);
		expect(ratingFillPercent(5)).toBe(100);
		expect(ratingFillPercent(0)).toBe(0);
	});

	it('uses the rounded rating and clamps out-of-range values', () => {
		expect(ratingFillPercent(4.67)).toBe(94);
		expect(ratingFillPercent(7)).toBe(100);
		expect(ratingFillPercent(-1)).toBe(0);
	});
});
