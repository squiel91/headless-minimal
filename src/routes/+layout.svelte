<script lang="ts">
	import '../app.css';
	import { page } from '$app/state';
	import { onMount, tick } from 'svelte';
	import type { Snippet } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { checkoutUi } from '#lib/checkout-ui.svelte';
	import { shopperUi } from '#lib/shopper-ui.svelte';
	import { content } from '#lib/content';
	import { linkAttrs, toSiteUrl } from '#lib/menu';
	import { buildFontFaceCss, buildFontFamily } from '#lib/storeFont';
	import Newsletter from '#lib/sections/Newsletter.svelte';
	import Search from '#lib/ui/icons/Search.svelte';
	import ShoppingCart from '#lib/ui/icons/ShoppingCart.svelte';
	import Heart from '#lib/ui/icons/Heart.svelte';
	import User from '#lib/ui/icons/User.svelte';
	import Menu from '#lib/ui/icons/Menu.svelte';
	import X from '#lib/ui/icons/X.svelte';
	import WhatsAppButton from '#lib/WhatsAppButton.svelte';
	import type { LayoutData } from './$types';

	interface Props {
		data: LayoutData;
		children: Snippet;
	}

	let { data, children }: Props = $props();
	const primary = $derived(data.store.personalization?.primaryColor ?? '#262626');
	const onPrimary = $derived(data.store.personalization?.primaryButtonTextColor ?? '#ffffff');
	const controlsByRounding: Record<string, string> = {
		none: '0',
		sm: '0.375rem',
		md: '0.75rem',
		lg: '1.25rem'
	};
	const panelsByRounding: Record<string, string> = {
		none: '0',
		sm: '0.5rem',
		md: '1rem',
		lg: '1.5rem'
	};
	const rounding = $derived(data.store.personalization?.rounding ?? 'md');
	const radiusControls = $derived(controlsByRounding[rounding] ?? '0.75rem');
	const radiusPanels = $derived(panelsByRounding[rounding] ?? '1rem');
	const fontFamily = $derived(buildFontFamily(data.store.personalization?.font ?? null));
	const fontFaceCss = $derived(buildFontFaceCss(data.store.personalization?.font ?? null));
	let count = $state<number | null>(null);
	const year = new Date().getFullYear();
	let status = $state('');
	let menuOpen = $state(false);
	let menuClosing = $state(false);
	let menuClosePromise: Promise<void> | null = null;
	let finishMenuClose: (() => void) | null = null;
	let shop: typeof import('#lib/shop') | null = null;

	// Current section of the site, for highlighting its menu link.
	function isCurrent(url: string): boolean {
		const path = page.url.pathname;
		return url === '/' ? path === '/' : path === url || path.startsWith(url + '/');
	}
	const whatsappHref = $derived(
		data.store.whatsappNumber ? `https://wa.me/${data.store.whatsappNumber.replace(/\D/g, '')}` : null
	);

	$effect(() => {
		document.body.style.overflow = menuOpen || menuClosing ? 'hidden' : '';
	});

	function motionDuration(): number {
		return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 240;
	}

	function slideDrawer(node: HTMLElement) {
		return fly(node, { x: -node.getBoundingClientRect().width, duration: motionDuration(), opacity: 1, easing: cubicOut });
	}

	async function openMenu(): Promise<void> {
		await menuClosePromise;
		menuOpen = true;
	}

	function closeMenu(): Promise<void> {
		if (menuClosePromise) return menuClosePromise;
		if (!menuOpen) return Promise.resolve();
		menuClosing = true;
		menuClosePromise = new Promise((resolve) => {
			finishMenuClose = () => {
				menuClosing = false;
				menuClosePromise = null;
				finishMenuClose = null;
				resolve();
			};
		});
		menuOpen = false;
		return menuClosePromise;
	}

	onMount(() => {
		let active = true;
		const onShopperStatus = () => {
			void shop?.refreshShopper().catch(() => {});
		};
		const onOverlayClose = () => {
			void refresh();
			onShopperStatus();
		};
		window.addEventListener('tiendu:shopper-status', onShopperStatus);
		window.addEventListener('tiendu:overlay-close', onOverlayClose);
		void import('#lib/shop').then((module) => {
			if (!active) return;
			shop = module;
			void refresh();
			onShopperStatus();
		}).catch((error) => {
			status = error instanceof Error ? error.message : String(error);
		});
		return () => {
			active = false;
			window.removeEventListener('tiendu:shopper-status', onShopperStatus);
			window.removeEventListener('tiendu:overlay-close', onOverlayClose);
		};
	});

	async function refresh(): Promise<void> {
		if (!shop) return;
		try {
			const { quantity } = await shop.getQuantity();
			count = quantity;
		} catch (error) {
			status = error instanceof Error ? error.message : String(error);
		}
	}

	async function search(event?: Event): Promise<void> {
		// Without the SDK ready, let the form submit natively to /busqueda.
		if (!shop) return;
		event?.preventDefault();
		status = '';
		try {
			await shop.openSearch('');
		} catch (error) {
			status = error instanceof Error ? error.message : String(error);
		}
	}

	async function checkout(): Promise<void> {
		if (!shop) return;
		status = '';
		try {
			await shop.openCheckout();
		} catch (error) {
			status = error instanceof Error ? error.message : String(error);
		}
	}

	async function openShopper(overlay: 'account' | 'wishlist'): Promise<void> {
		status = '';
		try {
			await closeMenu();
			await tick();
			const client = shop ?? await import('#lib/shop');
			await client.openShopperOverlay(overlay);
		} catch (error) {
			status = error instanceof Error ? error.message : String(error);
		}
	}
</script>

<svelte:window
	onkeydown={(event) => {
		if (event.key === 'Escape') void closeMenu();
	}}
/>

<a
	href="#contenido"
	class="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-white focus:p-2 focus:font-bold focus:text-(--primary)"
>
	Saltar al contenido
</a>

<svelte:head>
	{#if fontFaceCss}
		{@html '<style>' + fontFaceCss.replace(/<\//g, '<\\/') + '</style>'}
	{/if}
</svelte:head>


<div class="theme" style="--primary: {primary}; --on-primary: {onPrimary}; --radius-controls: {radiusControls}; --radius-panels: {radiusPanels}; --font-family: {fontFamily};">
<header class="sticky top-0 z-30 border-b border-line bg-paper/90 backdrop-blur">
	<div class="wrap flex h-16 items-center gap-3 md:h-20 md:gap-6">
		<button
			class="-ml-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-(--radius-controls) transition-colors hover:bg-surface lg:hidden"
			onclick={openMenu}
			aria-label="Abrir menú"
			aria-haspopup="dialog"
			aria-expanded={menuOpen}
		>
			<Menu />
		</button>
		<a class="min-w-0 truncate text-lg font-semibold tracking-tight md:text-xl" href="/">{data.store.name}</a>
		{#if data.mainMenu}
			<nav class="hidden gap-8 lg:ml-6 lg:flex" aria-label="Principal">
				{#each data.mainMenu.items as item}
					<a
						class="text-sm transition-colors hover:text-ink {isCurrent(toSiteUrl(item)) ? 'text-ink' : 'text-muted'}"
						href={toSiteUrl(item)}
						aria-current={isCurrent(toSiteUrl(item)) ? 'page' : undefined}
						{...linkAttrs(item)}>{item.label}</a
					>
				{/each}
			</nav>
		{/if}
		<div class="ml-auto flex shrink-0 items-center gap-1">
			<form method="GET" action="/busqueda" onsubmit={search}>
				<button
					class="flex h-10 w-10 items-center justify-center rounded-(--radius-controls) transition-colors hover:bg-surface"
					type="submit"
					aria-label="Buscar"
				>
					<Search size={20} strokeWidth={1.75} />
				</button>
			</form>
			<button
				type="button"
				class="hidden h-10 w-10 items-center justify-center rounded-(--radius-controls) transition-colors hover:bg-surface disabled:opacity-60 lg:flex"
				aria-label={shopperUi.shopper?.name ? `Mi cuenta, ${shopperUi.shopper.name}` : 'Mi cuenta'}
				title={shopperUi.shopper?.name ? `Mi cuenta, ${shopperUi.shopper.name}` : 'Mi cuenta'}
				aria-busy={shopperUi.opening === 'account'}
				disabled={shopperUi.opening !== null}
				onclick={() => openShopper('account')}
			>
				<User />
			</button>
			<button
				type="button"
				class="relative hidden h-10 w-10 items-center justify-center rounded-(--radius-controls) transition-colors hover:bg-surface disabled:opacity-60 lg:flex"
				aria-label={shopperUi.wishlistProductIds.length ? `Favoritos, ${shopperUi.wishlistProductIds.length} productos` : 'Favoritos'}
				title="Favoritos"
				aria-busy={shopperUi.opening === 'wishlist'}
				disabled={shopperUi.opening !== null}
				onclick={() => openShopper('wishlist')}
			>
				<Heart />
				{#if shopperUi.wishlistProductIds.length}
					<span class="absolute top-0 right-0 rounded-full bg-ink px-1 text-[0.625rem] text-paper" aria-hidden="true">{shopperUi.wishlistProductIds.length}</span>
				{/if}
			</button>
			<button
				class="relative flex h-10 items-center gap-2 rounded-(--radius-controls) px-2.5 transition-colors hover:bg-surface disabled:opacity-60"
				onclick={checkout}
				disabled={checkoutUi.opening}
				aria-label={count ? `Carrito, ${count} productos` : 'Carrito'}
			>
				<ShoppingCart size={20} strokeWidth={1.75} />
				<span class="hidden text-sm sm:inline">Carrito</span>
				{#if count}
					<span
						class="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-(--primary) px-1 text-xs font-medium text-(--on-primary)"
						aria-hidden="true"
					>
						{count}
					</span>
				{/if}
			</button>
		</div>
	</div>
</header>

{#if menuOpen}
	<div class="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menú">
		<button
			class="absolute inset-0 h-full w-full cursor-default bg-ink/40"
			transition:fade={{ duration: motionDuration() }}
			aria-label="Cerrar menú"
			onclick={closeMenu}
		></button>
		<aside class="absolute top-0 left-0 flex h-full w-[85%] max-w-sm flex-col bg-paper px-6 py-5" transition:slideDrawer onoutroend={() => finishMenuClose?.()}>
			<div class="mb-10 flex shrink-0 items-center justify-between">
				<span class="eyebrow">Menú</span>
				<button class="flex h-10 w-10 items-center justify-center rounded-(--radius-controls) transition-colors hover:bg-surface" type="button" aria-label="Cerrar menú" onclick={closeMenu}><X /></button>
			</div>
			<nav class="min-h-0 flex-1 overflow-y-auto" aria-label="Principal">
				<ul class="flex flex-col gap-4">
					{#each data.mainMenu?.items ?? [] as item}
						<li>
							<a
								class="text-title font-medium {isCurrent(toSiteUrl(item)) ? '' : 'text-muted'}"
								href={toSiteUrl(item)}
								aria-current={isCurrent(toSiteUrl(item)) ? 'page' : undefined}
								{...linkAttrs(item)}
								onclick={closeMenu}
							>
								{item.label}
							</a>
						</li>
					{/each}
				</ul>
			</nav>
			<div class="mt-6 flex shrink-0 flex-col gap-2 border-t border-line pt-4 pb-[env(safe-area-inset-bottom)]">
				<button
					type="button"
					class="flex min-h-11 items-center gap-3 text-left disabled:opacity-60"
					aria-label={shopperUi.shopper?.name ? `Mi cuenta, ${shopperUi.shopper.name}` : 'Mi cuenta'}
					aria-busy={shopperUi.opening === 'account'}
					disabled={shopperUi.opening !== null}
					onclick={() => openShopper('account')}
				>
					<User /><span>Mi cuenta</span>
				</button>
				<button
					type="button"
					class="flex min-h-11 items-center gap-3 text-left disabled:opacity-60"
					aria-label={shopperUi.wishlistProductIds.length ? `Favoritos, ${shopperUi.wishlistProductIds.length} productos` : 'Favoritos'}
					aria-busy={shopperUi.opening === 'wishlist'}
					disabled={shopperUi.opening !== null}
					onclick={() => openShopper('wishlist')}
				>
					<Heart /><span>Favoritos</span>
					{#if shopperUi.wishlistProductIds.length}
						<span class="ml-auto text-sm" aria-hidden="true">{shopperUi.wishlistProductIds.length}</span>
					{/if}
				</button>
			</div>
		</aside>
	</div>
{/if}
{#if status}<p class="wrap py-2 text-sm" role="status">{status}</p>{/if}

<!-- Each page sets its own width (usually with the `wrap` utility). -->
<main id="contenido">
	{@render children()}
</main>

<Newsletter {...content.newsletter} />

<footer class="wrap pt-16 pb-8 text-sm md:pt-24">
	<div class="grid gap-12 md:grid-cols-4">
		<div class="md:col-span-2">
			<a class="text-title font-medium" href="/">{data.store.name}</a>
			{#if data.store.emailAddress || whatsappHref}
				<ul class="mt-6 flex flex-col gap-2 text-muted">
					{#if data.store.emailAddress}
						<li>
							<a class="transition-colors hover:text-ink" href="mailto:{data.store.emailAddress}">{data.store.emailAddress}</a>
						</li>
					{/if}
					{#if whatsappHref}
						<li>
							<a class="transition-colors hover:text-ink" href={whatsappHref} target="_blank" rel="noopener">
								WhatsApp {data.store.whatsappNumber}
							</a>
						</li>
					{/if}
				</ul>
			{/if}
		</div>
		{#if data.collections.length}
			<nav aria-label="Colecciones">
				<h2 class="eyebrow mb-5">Colecciones</h2>
				<ul class="flex flex-col gap-3">
					{#each data.collections as c}
						<li><a class="hover:underline hover:underline-offset-4" href="/categorias/{c.handle}">{c.name}</a></li>
					{/each}
				</ul>
			</nav>
		{/if}
		{#if data.infoMenu}
			<nav aria-label="Información">
				<h2 class="eyebrow mb-5">{data.infoMenu.title}</h2>
				<ul class="flex flex-col gap-3">
					{#each data.infoMenu.items as item}
						<li>
							<a class="hover:underline hover:underline-offset-4" href={toSiteUrl(item)} {...linkAttrs(item)}>{item.label}</a>
						</li>
					{/each}
				</ul>
			</nav>
		{:else if data.pages.length}
			<nav aria-label="Información">
				<h2 class="eyebrow mb-5">Información</h2>
				<ul class="flex flex-col gap-3">
					{#each data.pages as p}
						<li><a class="hover:underline hover:underline-offset-4" href="/paginas/{p.handle}">{p.title}</a></li>
					{/each}
				</ul>
			</nav>
		{/if}
	</div>
	<p class="mt-16 border-t border-line pt-6 text-muted md:mt-24">
		© {year} {data.store.name}. Todos los derechos reservados.
	</p>
</footer>

{#if data.store.whatsappNumber}
	<WhatsAppButton number={data.store.whatsappNumber} {...content.whatsapp} />
{/if}
</div>
