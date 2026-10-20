/** Long Spanish date for posts: "15 de octubre de 2025". Empty for null. */
export function formatDate(iso: string | null): string {
	if (!iso) return '';
	return new Date(iso).toLocaleDateString('es-UY', { day: 'numeric', month: 'long', year: 'numeric' });
}
