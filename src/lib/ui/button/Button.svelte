<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		variant?: 'primary' | 'secondary';
		size?: 'sm' | 'md' | 'lg' | 'xl';
		href?: string;
		type?: 'button' | 'submit';
		disabled?: boolean;
		loading?: boolean;
		ariaLabel?: string;
		/** Stretch to the container width. */
		full?: boolean;
		onclick?: (event: MouseEvent) => void;
		children: Snippet;
	}

	let {
		variant = 'primary',
		size = 'md',
		href,
		type = 'button',
		disabled = false,
		loading = false,
		ariaLabel,
		full = false,
		onclick,
		children
	}: Props = $props();

	const sizes = {
		sm: 'px-2 py-1 text-xs',
		md: 'px-3 py-1 text-sm',
		lg: 'px-4 py-2 text-base',
		xl: 'h-14 px-7 text-base font-medium'
	};

	const variants = {
		primary: 'border border-(--primary) bg-(--primary) text-(--on-primary)',
		secondary: 'btn-secondary'
	};

	const classes = $derived(
		`relative inline-flex items-center justify-center gap-2 rounded-(--radius-controls) ${variants[variant]} ${sizes[size]} ${full ? 'w-full' : ''}`
	);
	const contentClasses = $derived(
		`inline-flex items-center gap-2 transition-opacity duration-200 ${loading ? 'opacity-0' : 'opacity-100 delay-200'}`
	);
	const dotsClasses = $derived(
		`pointer-events-none absolute inset-0 flex items-center justify-center gap-1 transition-all duration-200 ${loading ? 'scale-100 opacity-100 delay-200' : 'scale-90 opacity-0'}`
	);
</script>

{#if href}
	<a class={classes} {href} aria-label={ariaLabel} aria-busy={loading}>
		<span class={contentClasses}>{@render children()}</span>
		<span class={dotsClasses} aria-hidden="true">
			<span class="btn-dot h-1.5 w-1.5 rounded-full bg-current"></span>
			<span class="btn-dot h-1.5 w-1.5 rounded-full bg-current"></span>
			<span class="btn-dot h-1.5 w-1.5 rounded-full bg-current"></span>
		</span>
	</a>
{:else}
	<button class={classes} {type} {disabled} aria-label={ariaLabel} aria-busy={loading} {onclick}>
		<span class={contentClasses}>{@render children()}</span>
		<span class={dotsClasses} aria-hidden="true">
			<span class="btn-dot h-1.5 w-1.5 rounded-full bg-current"></span>
			<span class="btn-dot h-1.5 w-1.5 rounded-full bg-current"></span>
			<span class="btn-dot h-1.5 w-1.5 rounded-full bg-current"></span>
		</span>
	</button>
{/if}
