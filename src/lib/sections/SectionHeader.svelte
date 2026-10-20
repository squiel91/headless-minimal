<!-- Shared section heading: eyebrow + title on the left, optional link on the right. -->
<script lang="ts">
	import ArrowRight from '#lib/ui/icons/ArrowRight.svelte';

	interface Props {
		eyebrow?: string;
		title: string;
		id?: string;
		link?: { label: string; href: string };
	}

	let { eyebrow, title, id, link }: Props = $props();
</script>

<div class="mb-10 flex flex-wrap items-end justify-between gap-x-8 gap-y-4 md:mb-14">
	<div>
		{#if eyebrow}<p class="eyebrow mb-4">{eyebrow}</p>{/if}
		<h2 {id} class="text-headline font-medium">{title}</h2>
	</div>
	{#if link}
		<a class="group inline-flex items-center gap-2 pb-2 font-medium" href={link.href}>
			<span class="underline-offset-4 group-hover:underline">{link.label}</span>
			<span class="transition-transform motion-safe:group-hover:translate-x-1"><ArrowRight size={18} /></span>
		</a>
	{/if}
</div>
