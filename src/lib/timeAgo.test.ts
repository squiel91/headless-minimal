import { describe, expect, it } from 'vitest';
import { timeAgoEs } from '#lib/timeAgo';

const now = new Date('2026-10-20T12:00:00Z');
const ago = (ms: number): Date => new Date(now.getTime() - ms);

describe('timeAgoEs', () => {
	it('says just now for recent and future dates', () => {
		expect(timeAgoEs(ago(10 * 1000), now)).toBe('Hace un momento');
		expect(timeAgoEs(new Date(now.getTime() + 60 * 1000), now)).toBe('Hace un momento');
	});

	it('uses minutes and hours with singular and plural', () => {
		expect(timeAgoEs(ago(60 * 1000), now)).toBe('hace 1 minuto');
		expect(timeAgoEs(ago(5 * 60 * 1000), now)).toBe('hace 5 minutos');
		expect(timeAgoEs(ago(60 * 60 * 1000), now)).toBe('hace 1 hora');
		expect(timeAgoEs(ago(3 * 60 * 60 * 1000), now)).toBe('hace 3 horas');
	});

	it('uses days, months and years', () => {
		expect(timeAgoEs(ago(24 * 60 * 60 * 1000), now)).toBe('hace 1 día');
		expect(timeAgoEs(ago(9 * 24 * 60 * 60 * 1000), now)).toBe('hace 9 días');
		expect(timeAgoEs(ago(30 * 24 * 60 * 60 * 1000), now)).toBe('hace 1 mes');
		expect(timeAgoEs(ago(75 * 24 * 60 * 60 * 1000), now)).toBe('hace 2 meses');
		expect(timeAgoEs(ago(400 * 24 * 60 * 60 * 1000), now)).toBe('hace 1 año');
	});
});
