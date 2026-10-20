<!-- Half image, half text. Set reverse to put the image on the right. -->
<script lang="ts">
	import ArrowRight from '#lib/ui/icons/ArrowRight.svelte';

	interface Props {
		eyebrow?: string;
		title: string;
		text?: string;
		link?: { label: string; href: string };
		image: { url: string; alt: string };
		reverse?: boolean;
	}

	let { eyebrow, title, text, link, image, reverse = false }: Props = $props();
</script>

<section class="wrap py-section">
	<div class="grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-16 lg:gap-24">
		<div class="overflow-hidden rounded-(--radius-panels) bg-surface {reverse ? 'md:order-last' : ''}">
			<img class="block aspect-[4/5] h-full w-full object-cover" src={image.url} alt={image.alt} loading="lazy" />
		</div>
		<div class="max-w-xl">
			{#if eyebrow}<p class="eyebrow mb-6">{eyebrow}</p>{/if}
			<h2 class="text-headline font-medium text-balance">{title}</h2>
			{#if text}<p class="mt-8 text-lg leading-relaxed text-muted">{text}</p>{/if}
			{#if link}
				<a class="group mt-10 inline-flex items-center gap-2 font-medium" href={link.href}>
					<span class="underline-offset-4 group-hover:underline">{link.label}</span>
					<span class="transition-transform motion-safe:group-hover:translate-x-1"><ArrowRight size={18} /></span>
				</a>
			{/if}
		</div>
	</div>
</section>
