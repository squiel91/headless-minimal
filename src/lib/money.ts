// Prices are integer cents; currency is UYU or USD.
export function formatMoney(cents: number | null | undefined, currency = 'UYU'): string {
	if (cents == null) return 'A consultar';
	return new Intl.NumberFormat('es-UY', {
		style: 'currency',
		currency,
		maximumFractionDigits: 0
	}).format(cents / 100);
}
