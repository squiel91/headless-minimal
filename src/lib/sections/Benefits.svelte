<!-- Short store promises (shipping, returns, payment) in numbered columns.
     Items with href link their title to the page with the details. -->
<script lang="ts">
	import ArrowRight from '#lib/ui/icons/ArrowRight.svelte';

	interface Props {
		items: { title: string; text: string; href?: string }[];
	}

	let { items }: Props = $props();
</script>

{#if items.length}
	<section class="wrap py-section">
		<ul class="grid gap-10 md:grid-cols-3 md:gap-8">
			{#each items as item, i (item.title)}
				<li class="border-t border-ink pt-6">
					<p class="eyebrow mb-8">{String(i + 1).padStart(2, '0')}</p>
					<h3 class="mb-3 text-2xl font-medium tracking-tight">
						{#if item.href}
							<a class="group inline-flex items-center gap-2" href={item.href}>
								<span class="underline-offset-4 group-hover:underline">{item.title}</span>
								<span class="transition-transform motion-safe:group-hover:translate-x-1"><ArrowRight size={20} /></span>
							</a>
						{:else}
							{item.title}
						{/if}
					</h3>
					<p class="text-muted">{item.text}</p>
				</li>
			{/each}
		</ul>
	</section>
{/if}
