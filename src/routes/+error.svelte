<script lang="ts">
	import { page } from '$app/state';
	import Button from '#lib/ui/button/Button.svelte';
	import ArrowRight from '#lib/ui/icons/ArrowRight.svelte';

	const notFound = $derived(page.status === 404);
	// SvelteKit's generic messages add nothing; specific ones ("Producto no encontrado") do.
	const detail = $derived(
		page.error?.message && !['Not Found', 'Internal Error'].includes(page.error.message)
			? page.error.message
			: null
	);
</script>

<svelte:head>
	<title>{notFound ? 'Página no encontrada' : 'Algo salió mal'}</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<section class="wrap pt-20 pb-section md:pt-32">
	<p class="eyebrow mb-6 md:mb-8">Error {page.status}{detail ? ` · ${detail}` : ''}</p>
	<h1 class="max-w-[14ch] text-display font-medium text-balance">
		{notFound ? 'No encontramos esta página.' : 'Algo salió mal.'}
	</h1>
	<p class="mt-10 max-w-md text-lg leading-relaxed text-muted md:mt-14 md:text-xl">
		{notFound
			? 'Puede que el enlace esté mal escrito o que el contenido ya no exista.'
			: 'Tuvimos un problema al cargar esta página. Probá de nuevo en unos minutos.'}
	</p>
	<div class="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
		<Button variant="primary" size="xl" href="/">Volver al inicio</Button>
		<a class="group inline-flex items-center gap-2 font-medium" href={notFound ? '/productos' : page.url.pathname}>
			<span class="underline-offset-4 group-hover:underline">{notFound ? 'Ver productos' : 'Reintentar'}</span>
			<span class="transition-transform motion-safe:group-hover:translate-x-1"><ArrowRight size={18} /></span>
		</a>
	</div>
</section>
