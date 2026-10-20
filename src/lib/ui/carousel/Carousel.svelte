<script lang="ts">
	import { onMount } from 'svelte';

	export interface CarouselImage {
		url: string;
		alt: string;
	}

	interface Props {
		images: CarouselImage[];
		title: string;
		focusUrl?: string | null;
	}

	let { images, title, focusUrl = null }: Props = $props();
	const arrow =
		'absolute top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-paper/90 text-ink shadow-sm transition-opacity disabled:opacity-0';

	const slides = $derived(
		images.length > 0 ? images : [{ url: '/placeholder.svg', alt: title }]
	);
	let activeUrl = $state<string | null>(null);
	const active = $derived(slides.find((image) => image.url === activeUrl) ?? slides[0]);
	const activeIndex = $derived(Math.max(0, slides.findIndex((image) => image.url === activeUrl)));

	let track: HTMLDivElement | null = $state(null);
	let strip: HTMLDivElement | null = $state(null);
	let reduceMotion = $state(false);
	let dragging = $state(false);
	let dragStartX = 0;
	let dragStartScroll = 0;
	// Visual overscroll past the first/last slide. scrollLeft can't leave
	// [0, max] in LTR, so the resistance is rendered as a transform instead.
	let overscrollX = 0;
	let settleRaf = 0;

	onMount(() => {
		reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	});

	function onScroll(): void {
		if (!track || slides.length === 0) return;
		const index = Math.round(track.scrollLeft / track.clientWidth);
		const bounded = Math.max(0, Math.min(slides.length - 1, index));
		const url = slides[bounded]?.url;
		if (url && url !== activeUrl) activeUrl = url;
	}

	function goTo(index: number): void {
		if (!track || slides.length === 0) return;
		stopSettle();
		track.style.scrollSnapType = '';
		setOverscroll(0);
		const bounded = Math.max(0, Math.min(slides.length - 1, index));
		const url = slides[bounded]?.url;
		if (!url) return;
		activeUrl = url;
		track.scrollTo({
			left: bounded * track.clientWidth,
			behavior: reduceMotion ? 'auto' : 'smooth'
		});
	}

	function setOverscroll(px: number): void {
		overscrollX = px;
		if (strip) strip.style.transform = px ? `translateX(${px}px)` : '';
	}

	function rubberBand(distance: number): number {
		// Asymptotes to 35% of the track width: the further past the edge,
		// the stronger the resistance.
		if (!track || distance <= 0) return 0;
		const c = track.clientWidth * 0.35;
		if (c <= 0) return 0;
		return (distance * c) / (c + distance);
	}

	function stopSettle(): void {
		if (settleRaf) cancelAnimationFrame(settleRaf);
		settleRaf = 0;
	}

	function settle(index: number): void {
		if (!track) return;
		stopSettle();
		track.style.scrollSnapType = 'none';
		const bounded = Math.max(0, Math.min(slides.length - 1, index));
		const target = bounded * track.clientWidth;
		const fromScroll = track.scrollLeft;
		const fromX = overscrollX;
		if (reduceMotion || (Math.abs(target - fromScroll) < 1 && Math.abs(fromX) < 1)) {
			track.style.scrollSnapType = '';
			track.scrollLeft = target;
			setOverscroll(0);
			return;
		}
		// Native smooth scrolling out of a pointerup handler lands instantly,
		// so the release is animated explicitly and snapping stays off until done.
		const t0 = performance.now();
		const duration = 350;
		const step = (now: number): void => {
			const t = Math.min(1, (now - t0) / duration);
			const eased = 1 - Math.pow(1 - t, 3);
			if (!track) {
				settleRaf = 0;
				return;
			}
			track.scrollLeft = fromScroll + (target - fromScroll) * eased;
			setOverscroll(fromX * (1 - eased));
			if (t < 1) {
				settleRaf = requestAnimationFrame(step);
			} else {
				settleRaf = 0;
				track.style.scrollSnapType = '';
			}
		};
		settleRaf = requestAnimationFrame(step);
	}

	function onPointerDown(event: PointerEvent): void {
		if (event.pointerType !== 'mouse' || event.button !== 0 || !track) return;
		stopSettle();
		dragging = true;
		dragStartX = event.clientX;
		// Fold any in-flight overscroll into the origin so grabbing mid-settle doesn't jump.
		dragStartScroll = track.scrollLeft - overscrollX;
		setOverscroll(0);
		// Mandatory snap fights script-driven scrollLeft, so suspend it during the drag.
		track.style.scrollSnapType = 'none';
		// Keep the gesture on the track when crossing overlayed arrows.
		try {
			track.setPointerCapture(event.pointerId);
		} catch {
			// Synthetic events may not support capture; moves still bubble.
		}
	}

	function onPointerMove(event: PointerEvent): void {
		if (!dragging || !track) return;
		event.preventDefault();
		// From slide geometry, not scrollWidth: the strip's own transform
		// would otherwise shrink the scrollable area mid-gesture and feed back.
		const max = (slides.length - 1) * track.clientWidth;
		const raw = dragStartScroll - (event.clientX - dragStartX);
		if (raw < 0) {
			track.scrollLeft = 0;
			setOverscroll(rubberBand(-raw));
		} else if (raw > max) {
			track.scrollLeft = max;
			setOverscroll(-rubberBand(raw - max));
		} else {
			track.scrollLeft = raw;
			setOverscroll(0);
		}
	}

	function endDrag(): void {
		if (!dragging) return;
		dragging = false;
		// Snap stays off until the animated settle below finishes.
		if (track) settle(Math.round(track.scrollLeft / track.clientWidth));
	}

	let lastFocusUrl: string | null = null;
	$effect(() => {
		if (focusUrl && focusUrl !== lastFocusUrl) {
			lastFocusUrl = focusUrl;
			const index = slides.findIndex((image) => image.url === focusUrl);
			if (index >= 0) goTo(index);
		}
	});
</script>

<div class="relative">
	<div
		bind:this={track}
		class="no-scrollbar relative flex snap-x snap-mandatory overflow-x-auto rounded-(--radius-panels) bg-surface"
		role="region"
		aria-roledescription="carrusel"
		aria-label="Imágenes del producto"
		onscroll={onScroll}
		onpointerdown={onPointerDown}
		onpointermove={onPointerMove}
		onpointerup={endDrag}
		onpointercancel={endDrag}
		onpointerleave={endDrag}
	>
		<div bind:this={strip} class="flex flex-none" style="width: {slides.length * 100}%">
			{#each slides as image (image.url)}
				<div class="shrink-0 snap-start snap-always" style="width: {100 / slides.length}%">
					<img
						class="block aspect-[4/5] w-full cursor-grab object-cover select-none active:cursor-grabbing"
						draggable="false"
						src={image.url}
						alt={image.alt || title}
						loading={image.url === slides[0]?.url ? 'eager' : 'lazy'}
					/>
				</div>
			{/each}
		</div>
		<!-- In-flow pin at the content end: the strip's own rubber-band transform
			would otherwise shrink the scrollable width mid-gesture. -->
		<div aria-hidden="true" class="h-0 w-px flex-none"></div>
	</div>
	{#if slides.length > 1}
		<button
			type="button"
			class="{arrow} left-3"
			aria-label="Imagen anterior"
			disabled={activeIndex <= 0}
			onclick={() => goTo(activeIndex - 1)}
		>
			<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg>
		</button>
		<button
			type="button"
			class="{arrow} right-3"
			aria-label="Imagen siguiente"
			disabled={activeIndex >= slides.length - 1}
			onclick={() => goTo(activeIndex + 1)}
		>
			<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
		</button>
	{/if}
</div>
{#if slides.length > 1 && images.length > 1}
	<div class="no-scrollbar -mx-1 mt-2 flex gap-2 overflow-x-auto p-1">
		{#each slides as image, i (image.url)}
			<button
				type="button"
				class="shrink-0 overflow-hidden rounded-(--radius-controls) bg-surface transition-opacity {image.url === active?.url
					? 'opacity-100 ring-1 ring-ink ring-offset-2'
					: 'opacity-60 hover:opacity-100'}"
				aria-label="Ver imagen {image.alt || title}"
				aria-current={image.url === active?.url}
				onclick={() => goTo(i)}
				onfocus={() => goTo(i)}
			>
				<img class="h-20 w-16 object-cover" src={image.url} alt="" loading="lazy" />
			</button>
		{/each}
	</div>
{/if}

<style>
	.no-scrollbar {
		scrollbar-width: none;
	}
	.no-scrollbar::-webkit-scrollbar {
		display: none;
	}
</style>
