<!-- Floating WhatsApp link. Rendered only when the store has a number. -->
<script lang="ts">
	import WhatsApp from '#lib/ui/icons/WhatsApp.svelte';

	interface Props {
		number: string;
		label: string;
		message?: string;
	}

	let { number, label, message }: Props = $props();
	const href = $derived(
		`https://wa.me/${number.replace(/\D/g, '')}` + (message ? `?text=${encodeURIComponent(message)}` : '')
	);
</script>

<a
	class="fixed right-4 bottom-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25d366] text-white shadow-lg transition-transform motion-safe:hover:scale-105 md:right-6 md:bottom-6"
	style="margin-bottom: env(safe-area-inset-bottom); margin-right: env(safe-area-inset-right);"
	{href}
	target="_blank"
	rel="noopener"
	aria-label={label}
	title={label}
>
	<WhatsApp size={28} />
</a>
