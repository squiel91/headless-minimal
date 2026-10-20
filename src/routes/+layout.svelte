<script lang="ts">
	import '../app.css';
	import { dev } from '$app/env';
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import type { Snippet } from 'svelte';
	import { checkoutUi } from '#lib/checkout-ui.svelte';
	import { content } from '#lib/content';
	import { linkAttrs, toSiteUrl } from '#lib/menu';
	import { buildFontFaceCss, buildFontFamily } from '#lib/storeFont';
	import Newsletter from '#lib/sections/Newsletter.svelte';
	import Search from '#lib/ui/icons/Search.svelte';
	import ShoppingCart from '#lib/ui/icons/ShoppingCart.svelte';
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
	// In dev, ?rounding=none|sm|md|lg previews another rounding without touching the store.
	const rounding = $derived(
		(dev && page.url.searchParams.get('rounding')) || data.store.personalization?.rounding || 'md'
	);
	const radiusControls = $derived(controlsByRounding[rounding] ?? '0.75rem');
	const radiusPanels = $derived(panelsByRounding[rounding] ?? '1rem');
	const fontFamily = $derived(buildFontFamily(data.store.personalization?.font ?? null));
	const fontFaceCss = $derived(buildFontFaceCss(data.store.personalization?.font ?? null));
	let count = $state<number | null>(null);
	const year = new Date().getFullYear();
	let status = $state('');
	let menuOpen = $state(false);
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
		document.body.style.overflow = menuOpen ? 'hidden' : '';
	});

	onMount(async () => {
		try {
			shop = await import('#lib/shop');
			const { quantity } = await shop.getQuantity();
			count = quantity;
			// Overlays don't report closing: refresh the badge when their frame leaves the page.
			new MutationObserver((records: MutationRecord[]) => {
				const closed = records.some((record) =>
					Array.from(record.removedNodes).some(
						(node) => node instanceof Element && node.id === 'left-iframe'
					)
				);
				if (closed) void refresh();
			}).observe(document.body, { childList: true });
		} catch (error) {
			status = error instanceof Error ? error.message : String(error);
		}
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
</script>

<svelte:window
	onkeydown={(event) => {
		if (event.key === 'Escape') menuOpen = false;
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
	<div class="wrap flex h-16 items-center gap-6 md:h-20">
		{#if data.mainMenu}
			<button
				class="-ml-1 px-1 py-2 font-medium sm:hidden"
				onclick={() => (menuOpen = true)}
				aria-haspopup="dialog"
				aria-expanded={menuOpen}
			>
				Menú
			</button>
		{/if}
		<a class="text-lg font-semibold tracking-tight md:text-xl" href="/">{data.store.name}</a>
		{#if data.mainMenu}
			<nav class="hidden gap-8 sm:ml-6 sm:flex" aria-label="Principal">
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
		<div class="ml-auto flex items-center gap-1">
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

{#if menuOpen && data.mainMenu}
	<div class="fixed inset-0 z-50 sm:hidden" role="dialog" aria-modal="true" aria-label="Menú">
		<button
			class="absolute inset-0 h-full w-full cursor-default bg-ink/40"
			aria-label="Cerrar menú"
			onclick={() => (menuOpen = false)}
		></button>
		<aside class="absolute top-0 left-0 h-full w-[85%] max-w-sm overflow-y-auto bg-paper px-6 py-5">
			<div class="mb-10 flex items-center justify-between">
				<span class="eyebrow">Menú</span>
				<button class="py-2 font-medium" onclick={() => (menuOpen = false)}>Cerrar</button>
			</div>
			<nav aria-label="Principal">
				<ul class="flex flex-col gap-4">
					{#each data.mainMenu.items as item}
						<li>
							<a
								class="text-title font-medium {isCurrent(toSiteUrl(item)) ? '' : 'text-muted'}"
								href={toSiteUrl(item)}
								aria-current={isCurrent(toSiteUrl(item)) ? 'page' : undefined}
								{...linkAttrs(item)}
								onclick={() => (menuOpen = false)}
							>
								{item.label}
							</a>
						</li>
					{/each}
				</ul>
			</nav>
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
