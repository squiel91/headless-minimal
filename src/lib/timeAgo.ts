/**
 * Spanish relative time for review dates.
 * "Hace un momento", "hace X minutos/horas", "hace X días/meses/años".
 */
export function timeAgoEs(input: string | Date, now: Date = new Date()): string {
	const date = input instanceof Date ? input : new Date(input);
	const diffMs = now.getTime() - date.getTime();
	if (!Number.isFinite(diffMs) || diffMs < 60 * 1000) return 'Hace un momento';

	const minutes = Math.floor(diffMs / (60 * 1000));
	if (minutes < 60) return `hace ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;

	const hours = Math.floor(minutes / 60);
	if (hours < 24) return `hace ${hours} ${hours === 1 ? 'hora' : 'horas'}`;

	const days = Math.floor(hours / 24);
	if (days < 30) return `hace ${days} ${days === 1 ? 'día' : 'días'}`;

	const months = Math.floor(days / 30);
	if (months < 12) return `hace ${months} ${months === 1 ? 'mes' : 'meses'}`;

	const years = Math.floor(months / 12);
	return `hace ${years} ${years === 1 ? 'año' : 'años'}`;
}
