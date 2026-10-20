<!-- Full-width band in the store's color with the newsletter signup. -->
<script lang="ts">
	interface Props {
		title: string;
		text?: string;
		success: string;
		privacy?: { label: string; href: string };
	}

	let { title, text, success, privacy }: Props = $props();
	let email = $state('');
	let status = $state('');
	let sending = $state(false);

	async function subscribe(event: Event): Promise<void> {
		event.preventDefault();
		if (sending) return;
		sending = true;
		status = '';
		try {
			const shop = await import('#lib/shop');
			await shop.subscribe(email.trim());
			status = success;
			email = '';
		} catch (error) {
			status = error instanceof Error ? error.message : String(error);
		} finally {
			sending = false;
		}
	}
</script>

<section class="bg-(--primary) text-(--on-primary)">
	<div class="wrap grid grid-cols-1 gap-10 py-section md:grid-cols-2 md:items-end">
		<div>
			<h2 class="text-headline font-medium text-balance">{title}</h2>
			{#if text}<p class="mt-6 max-w-md text-lg opacity-80">{text}</p>{/if}
		</div>
		<form class="w-full md:justify-self-end md:max-w-md" onsubmit={subscribe}>
			<div class="flex items-center gap-4 border-b border-current pb-3">
				<input
					class="min-w-0 flex-1 bg-transparent py-2 text-lg !rounded-none placeholder:text-current placeholder:opacity-60 focus:outline-none"
					type="email"
					required
					bind:value={email}
					placeholder="tu@correo.com"
					aria-label="Correo electrónico"
				/>
				<button class="shrink-0 font-medium underline-offset-4 hover:underline disabled:opacity-60" type="submit" disabled={sending}>
					{sending ? 'Enviando…' : 'Suscribirme'}
				</button>
			</div>
			{#if status}<p class="mt-3 text-sm" role="status">{status}</p>{/if}
			{#if privacy}
				<p class="mt-3 text-sm opacity-70">
					Al suscribirte aceptás nuestra
					<a class="underline underline-offset-2 hover:opacity-100" href={privacy.href}>{privacy.label.toLowerCase()}</a>.
				</p>
			{/if}
		</form>
	</div>
</section>
