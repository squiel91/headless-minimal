<!-- Type-only hero: oversized headline, one line of text, one primary action. -->
<script lang="ts">
	import Button from '#lib/ui/button/Button.svelte';
	import ArrowRight from '#lib/ui/icons/ArrowRight.svelte';

	interface Props {
		eyebrow?: string;
		title: string;
		text?: string;
		primary?: { label: string; href: string };
		secondary?: { label: string; href: string };
	}

	let { eyebrow, title, text, primary, secondary }: Props = $props();
</script>

<section class="wrap pt-20 pb-section md:pt-32">
	{#if eyebrow}<p class="eyebrow mb-6 md:mb-8">{eyebrow}</p>{/if}
	<h1 class="max-w-[14ch] text-display font-medium text-balance">{title}</h1>
	<div class="mt-10 flex flex-col gap-8 md:mt-14 md:flex-row md:items-end md:justify-between">
		{#if text}<p class="max-w-md text-lg leading-relaxed text-muted md:text-xl">{text}</p>{/if}
		{#if primary || secondary}
			<div class="flex flex-wrap items-center gap-x-8 gap-y-4">
				{#if primary}
					<Button variant="primary" size="xl" href={primary.href}>{primary.label}</Button>
				{/if}
				{#if secondary}
					<a class="group inline-flex items-center gap-2 font-medium" href={secondary.href}>
						<span class="underline-offset-4 group-hover:underline">{secondary.label}</span>
						<span class="transition-transform motion-safe:group-hover:translate-x-1"><ArrowRight size={18} /></span>
					</a>
				{/if}
			</div>
		{/if}
	</div>
</section>
