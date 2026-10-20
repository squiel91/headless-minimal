<script lang="ts">
	export interface Crumb {
		label: string;
		href?: string;
	}

	interface Props {
		trail: Crumb[];
	}

	let { trail }: Props = $props();
</script>

<nav aria-label="Breadcrumb" class="text-sm text-muted">
	<ol class="flex items-center gap-2 overflow-hidden whitespace-nowrap">
		{#each trail as crumb, i (crumb.label)}
			{@const last = i === trail.length - 1}
			{@const middle = i > 0 && !last}
			<li
				class="min-w-0 items-center gap-2 {last ? 'flex flex-1' : 'shrink-0'} {middle
					? 'hidden sm:flex'
					: 'flex'}"
			>
				{#if i > 0}<span aria-hidden="true" class="shrink-0 opacity-40">/</span>{/if}
				{#if last}
					<span aria-current="page" class="truncate text-ink">{crumb.label}</span>
				{:else if crumb.href}
					<a class="shrink-0 transition-colors hover:text-ink" href={crumb.href}>{crumb.label}</a>
				{:else}
					<span class="shrink-0">{crumb.label}</span>
				{/if}
			</li>
		{/each}
	</ol>
</nav>
