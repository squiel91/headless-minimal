<script lang="ts">
	import { shopperUi } from '#lib/shopper-ui.svelte';
	import Heart from '#lib/ui/icons/Heart.svelte';

	let { productId, title, label = false }: { productId: string; title: string; label?: boolean } = $props();
	const saved = $derived(shopperUi.wishlistProductIds.includes(Number(productId)));
	const busy = $derived(shopperUi.pendingProductIds.includes(String(productId)));
	let error = $state('');
	let message = $state('');

	async function toggle(): Promise<void> {
		error = '';
		message = '';
		try {
			const shop = await import('#lib/shop');
			const result = await shop.toggleWishlist(productId);
			if (result !== null) message = result ? 'Producto guardado en favoritos.' : 'Producto quitado de favoritos.';
		} catch (cause) {
			error = cause instanceof Error ? cause.message : String(cause);
		}
	}
</script>

<button
	type="button"
	class={label
		? 'inline-flex min-h-10 items-center gap-2 text-sm text-muted transition-colors hover:text-ink disabled:opacity-60'
		: 'flex h-10 w-10 items-center justify-center rounded-(--radius-controls) bg-paper transition-colors hover:bg-surface disabled:opacity-60'}
	aria-label={`${saved ? 'Quitar' : 'Guardar'} ${title} ${saved ? 'de' : 'en'} favoritos`}
	aria-pressed={saved}
	aria-busy={busy}
	disabled={busy}
	onclick={toggle}
>
	<Heart filled={saved} />
	{#if label}<span>{saved ? 'Quitar de favoritos' : 'Guardar en favoritos'}</span>{/if}
</button>
<span class="sr-only" role="status">{message}</span>
{#if error}<p class="max-w-48 bg-paper p-2 text-sm" role="alert">{error}</p>{/if}
