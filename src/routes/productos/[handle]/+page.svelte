<script lang="ts">
	import { onMount } from 'svelte';
	import { formatMoney } from '#lib/money';
	import OptionDropdown from '#lib/ui/dropdown/Dropdown.svelte';
	import Carousel from '#lib/ui/carousel/Carousel.svelte';
	import Button from '#lib/ui/button/Button.svelte';
	import Forward from '#lib/ui/icons/Forward.svelte';
	import Breadcrumbs from '#lib/Breadcrumbs.svelte';
	import Rating from '#lib/Rating.svelte';
	import { content } from '#lib/content';
	import { formatRating } from '#lib/rating';
	import ProductGrid from '#lib/sections/ProductGrid.svelte';
	import ArrowRight from '#lib/ui/icons/ArrowRight.svelte';
	import { buildProductJsonLd } from '#lib/productJsonLd';
	import { timeAgoEs } from '#lib/timeAgo';
	import ValueSwatch from '#lib/ValueSwatch.svelte';
	import {
		commonCompareAt,
		commonImage,
		commonStock,
		galleryImages,
		isValueAvailable,
		matchingVariants,
		minPriceOf,
		pruneSelection,
		uniformPrice
	} from '#lib/variants';
	import type { OptionValue, ProductOption, Variant } from '#lib/tiendu';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
	const product = $derived(data.product);

	// No default selection: every option starts empty.
	let selected = $state<Record<string, string | undefined>>({});
	let quantity = $state(1);
	let status = $state('');
	let phase = $state<'idle' | 'adding' | 'opening'>('idle');
	let shop: typeof import('#lib/shop') | null = null;

	const variants = $derived(product.variants ?? []);
	const matching = $derived(matchingVariants(variants, selected));
	const gallery = $derived(galleryImages(product.images ?? [], variants));

	// Drop selections that became incompatible with the other choices.
	// Removing a selection only widens the compatible sets, so this converges.
	$effect(() => {
		selected = pruneSelection(
			variants,
			selected,
			(product.options ?? []).map((o) => o.name)
		);
	});

	function optionStates(
		option: ProductOption
	): { value: OptionValue; available: boolean }[] {
		return option.values.map((v) => ({
			value: v,
			available: isValueAvailable(variants, selected, option.name, v.value)
		}));
	}

	// Exactly one match means the shopper completed the selection.
	const chosen = $derived<Variant | undefined>(
		matching.length === 1 ? matching[0] : undefined
	);

	const minPrice = $derived(minPriceOf(matching) ?? product.priceMinInCents);

	// Plain price when every filtered variant costs the same.
	const samePrice = $derived(uniformPrice(matching));

	// Compare-at shows only when every filtered variant agrees on it.
	const compareAt = $derived(commonCompareAt(matching));

	const stockInfo = $derived(commonStock(matching));

	// Show the variant image as soon as the selection narrows to one (e.g. color picked, size not yet).
	const focusImage = $derived(chosen?.image ?? commonImage(matching));

	const title = $derived(product.seo.title || product.title);
	let cartError = $state<string | null>(null);
	const jsonLd = $derived(JSON.stringify(buildProductJsonLd(product)));

	onMount(async () => {
		shop = await import('#lib/shop');
		shop.trackViewItem(product, chosen).catch((error: unknown) => {
			status = error instanceof Error ? error.message : String(error);
		});
	});

	async function add(): Promise<void> {
		status = '';
		cartError = null;
		if (!shop) {
			cartError = 'La tienda aún se está cargando, intenta de nuevo.';
			return;
		}
		if (!chosen || !chosen.available) {
			cartError = 'Selecciona todas las opciones disponibles.';
			return;
		}
		phase = 'adding';
		try {
			await shop.addToCart(product, chosen, quantity);
			phase = 'opening';
			await shop.openCheckout();
		} catch (error) {
			cartError = error instanceof Error ? error.message : String(error);
		} finally {
			phase = 'idle';
		}
	}

	function closeCartError(): void {
		cartError = null;
	}

	function onCartErrorKeydown(event: KeyboardEvent): void {
		if (event.key === 'Escape') closeCartError();
	}

	async function shareProduct(): Promise<void> {
		status = '';
		const url = window.location.href;
		try {
			if (navigator.share) {
				await navigator.share({ title, text: product.title, url });
			} else if (navigator.clipboard) {
				await navigator.clipboard.writeText(url);
				status = 'Enlace copiado al portapapeles.';
			} else {
				status = 'Copiá el enlace de la barra de direcciones para compartir.';
			}
		} catch (error) {
			if (error instanceof DOMException && error.name === 'AbortError') return;
			status = error instanceof Error ? error.message : String(error);
		}
	}
</script>

<svelte:window onkeydown={onCartErrorKeydown} />

<svelte:head>
	<title>{title} | {data.store.name}</title>
	{#if product.seo.description || product.description}
		<meta name="description" content={product.seo.description || product.description} />
	{/if}
	<meta property="og:type" content="product" />
	<meta property="og:title" content={title} />
	{#if product.seo.description || product.description}
		<meta property="og:description" content={product.seo.description || product.description} />
	{/if}
	<meta
		property="og:image"
		content={product.coverImage?.url ?? gallery[0]?.url ?? '/placeholder.svg'}
	/>
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	{#if product.seo.description || product.description}
		<meta
			name="twitter:description"
			content={product.seo.description || product.description}
		/>
	{/if}
	<meta
		name="twitter:image"
		content={product.coverImage?.url ?? gallery[0]?.url ?? '/placeholder.svg'}
	/>
	{@html '<' + 'script type="application/ld+json">' + jsonLd + '</' + 'script>'}
</svelte:head>

<div class="wrap pt-8">
	<Breadcrumbs trail={[{ label: 'Inicio', href: '/' }, { label: 'Productos', href: '/productos' }, { label: product.title }]} />

	<div class="mt-8 grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-12 lg:gap-20">
		<div class="md:col-span-7">
			{#key data.handle}
				<Carousel images={gallery} title={product.title} focusUrl={focusImage?.url ?? null} />
			{/key}
		</div>

		<div class="md:col-span-5 md:pt-4">
			<h1 class="text-title font-medium text-balance">{product.title}</h1>

			<div class="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-2">
				<p class="text-2xl">
					{#if chosen}
						{formatMoney(chosen.priceInCents ?? product.priceMinInCents, product.currency)}
					{:else if samePrice != null}
						{formatMoney(samePrice, product.currency)}
					{:else if matching.length > 1}
						Desde {formatMoney(minPrice, product.currency)}
					{:else}
						No disponible
					{/if}
					{#if compareAt != null}
						<s class="ml-2 text-lg text-muted">{formatMoney(compareAt, product.currency)}</s>
					{/if}
				</p>
				{#if (product.reviews ?? []).length > 0}
					<a class="ml-auto" href="#resenas">
						<Rating rating={product.rating ?? null} count={product.reviewsCount ?? 0} />
					</a>
				{/if}
			</div>

			<div class="mt-10 flex flex-col gap-8 border-t border-line pt-8">
				{#each product.options ?? [] as option (option.name)}
					{#if option.displayType === 'dropdown' || option.displayType === 'select'}
						<OptionDropdown
							name={option.name}
							values={option.values}
							disabledValues={optionStates(option)
								.filter((s) => !s.available)
								.map((s) => s.value.value)}
							selected={selected[option.name]}
							onselect={(value) => {
								selected[option.name] = value;
							}}
						/>
					{:else}
						<fieldset>
							<legend class="mb-3 text-sm">
								<span class="text-muted">{option.name}:</span>
								{selected[option.name] ?? ''}
							</legend>
							<div class="flex flex-wrap gap-2">
								{#each optionStates(option) as s (s.value.value)}
									<button
										type="button"
										class="flex min-h-12 items-stretch overflow-hidden rounded-(--radius-controls) border p-0 transition-colors {selected[option.name] === s.value.value
											? 'border-ink ring-1 ring-ink'
											: 'border-line hover:border-ink'} {s.available ? '' : 'cursor-not-allowed opacity-40 line-through'}"
										aria-pressed={selected[option.name] === s.value.value}
										disabled={!s.available}
										onclick={() => {
											selected[option.name] =
												selected[option.name] === s.value.value ? undefined : s.value.value;
										}}
									>
										<ValueSwatch value={s.value} label={s.value.value} />
										<span class="self-center px-4">{s.value.value}</span>
									</button>
								{/each}
							</div>
						</fieldset>
					{/if}
				{/each}

				<div>
					<p class="mb-3 flex items-center gap-2 text-sm text-muted">
						<span
							class="h-2 w-2 rounded-full {stockInfo.unanimous && stockInfo.stock != null && stockInfo.stock <= 0
								? 'bg-line'
								: 'bg-ink'}"
							aria-hidden="true"
						></span>
						{#if !stockInfo.unanimous}
							Seleccioná las opciones para ver el stock.
						{:else if stockInfo.stock == null}
							En stock
						{:else if stockInfo.stock <= 0}
							Temporalmente agotado
						{:else}
							{stockInfo.stock} en stock
						{/if}
					</p>
					<div class="flex gap-3">
						<div class="inline-flex h-14 shrink-0 items-center rounded-(--radius-controls) border border-line">
							<button
								type="button"
								class="flex h-full w-11 items-center justify-center text-lg disabled:opacity-30"
								aria-label="Restar uno"
								disabled={quantity <= 1}
								onclick={() => (quantity = Math.max(1, quantity - 1))}
							>
								−
							</button>
							<input
								class="w-8 bg-transparent text-center [appearance:textfield] focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
								type="number"
								min="1"
								bind:value={quantity}
								aria-label="Cantidad"
							/>
							<button
								type="button"
								class="flex h-full w-11 items-center justify-center text-lg"
								aria-label="Sumar uno"
								onclick={() => (quantity += 1)}
							>
								+
							</button>
						</div>
						<div class="min-w-0 flex-1">
							<Button variant="primary" size="xl" full onclick={add} loading={phase !== 'idle'}>
								Agregar al carrito
							</Button>
						</div>
					</div>
					<button
						type="button"
						class="mt-4 inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-ink"
						onclick={shareProduct}
					>
						<Forward size={16} strokeWidth={1.75} />
						Compartir
					</button>
					{#if status}<p class="mt-2 text-sm" role="status">{status}</p>{/if}
				</div>

				{#if content.product.showBenefits && content.benefits.length}
					<ul class="flex flex-col gap-2 text-sm text-muted">
						{#each content.benefits as benefit (benefit.title)}
							<li class="flex gap-3">
								<span aria-hidden="true">—</span>
								{#if benefit.href}
									<a class="group inline-flex items-center gap-1.5 transition-colors hover:text-ink" href={benefit.href}>
										<span class="underline underline-offset-4 decoration-line group-hover:decoration-current">{benefit.title}</span>
										<span class="transition-transform motion-safe:group-hover:translate-x-0.5"><ArrowRight size={14} /></span>
									</a>
								{:else}
									{benefit.title}
								{/if}
							</li>
						{/each}
					</ul>
				{/if}
			</div>

			{#if product.description || product.specifications?.length}
				<div class="mt-10 border-b border-line">
					{#if product.description}
						<details class="group border-t border-line" open>
							<summary class="flex cursor-pointer list-none items-center justify-between py-5 font-medium [&::-webkit-details-marker]:hidden">
								Descripción
								<span class="text-xl leading-none transition-transform group-open:rotate-45" aria-hidden="true">+</span>
							</summary>
							<p class="pb-6 leading-relaxed whitespace-pre-line text-muted">{product.description}</p>
						</details>
					{/if}
					{#if product.specifications?.length}
						<details class="group border-t border-line">
							<summary class="flex cursor-pointer list-none items-center justify-between py-5 font-medium [&::-webkit-details-marker]:hidden">
								Especificaciones
								<span class="text-xl leading-none transition-transform group-open:rotate-45" aria-hidden="true">+</span>
							</summary>
							<dl class="pb-6 text-sm">
								{#each product.specifications as spec (spec.name)}
									<div class="flex justify-between gap-6 border-t border-line py-3 first:border-t-0">
										<dt class="text-muted">{spec.name}</dt>
										<dd class="text-right">{spec.value}</dd>
									</div>
								{/each}
							</dl>
						</details>
					{/if}
				</div>
			{/if}
		</div>
	</div>
</div>

{#if cartError}
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Error al agregar al carrito">
		<button
			class="absolute inset-0 h-full w-full cursor-default bg-ink/40"
			aria-label="Cerrar"
			onclick={closeCartError}
		></button>
		<div class="relative w-full max-w-sm rounded-(--radius-panels) bg-paper p-6">
			<h2 class="mb-3 text-xl font-medium tracking-tight">No se pudo agregar al carrito</h2>
			<p class="mb-2">{cartError}</p>
			<p class="mb-6 text-sm text-muted">
				Para agregarlo: elegí todas las opciones del producto, ajustá la cantidad y tocá
				“Agregar al carrito” de nuevo.
			</p>
			<Button variant="primary" size="lg" onclick={closeCartError}>Entendido</Button>
		</div>
	</div>
{/if}

{#if (product.reviews ?? []).length > 0}
	<section id="resenas" class="wrap mt-section scroll-mt-24 border-t border-line pt-section">
		<div class="grid grid-cols-1 gap-12 md:grid-cols-12">
			<div class="md:col-span-4">
				<p class="eyebrow mb-6">Reseñas</p>
				{#if product.rating != null}
					<p class="text-display font-medium">{formatRating(product.rating)}</p>
				{/if}
				<div class="mt-4">
					<Rating rating={product.rating ?? null} count={product.reviewsCount ?? 0} showCount={false} starSize={18} />
				</div>
				<p class="mt-2 text-sm text-muted">
					{product.reviewsCount}
					{product.reviewsCount === 1 ? 'reseña' : 'reseñas'}
				</p>
			</div>
			<ul class="divide-y divide-line border-y border-line md:col-span-8">
				{#each product.reviews as review, i (i)}
					<li class="py-8">
						<Rating rating={review.rating} count={1} showCount={false} />
						<p class="mt-4 text-lg leading-relaxed whitespace-pre-line">{review.content}</p>
						{#if (review.images ?? []).length > 0}
							<div class="mt-4 flex gap-2 overflow-x-auto">
								{#each review.images as image (image.url)}
									<img
										class="h-20 w-20 rounded-(--radius-controls) object-cover"
										src={image.url}
										alt={image.alt || 'Imagen de la reseña'}
										loading="lazy"
									/>
								{/each}
							</div>
						{/if}
						<p class="mt-4 text-sm text-muted">
							<span class="text-ink">{review.authorName}</span>
							{#if review.verifiedPurchase}<span class="ml-2">· Compra verificada</span>{/if}
							{#if review.createdAt}<span class="ml-2">· {timeAgoEs(review.createdAt)}</span>{/if}
						</p>
					</li>
				{/each}
			</ul>
		</div>
	</section>
{/if}

<ProductGrid {...content.product.related} products={product.related ?? []} />
