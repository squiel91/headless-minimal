/** Round a rating to one decimal for display, with a decimal comma (4.67 -> "4,7", 5 -> "5"). */
export function formatRating(rating: number): string {
	return String(Math.round(rating * 10) / 10).replace('.', ',');
}

/** Fill percentage of the star overlay, clamped to 0-100 (4.5 -> 90). */
export function ratingFillPercent(rating: number): number {
	return Math.min(100, Math.max(0, (Math.round(rating * 10) / 10 / 5) * 100));
}
