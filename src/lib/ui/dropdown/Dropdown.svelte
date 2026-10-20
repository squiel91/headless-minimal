<script lang="ts">
	import ValueSwatch from '#lib/ValueSwatch.svelte';
	import type { OptionValue } from '#lib/tiendu';

	interface Props {
		name: string;
		values: OptionValue[];
		disabledValues: string[];
		selected: string | undefined;
		onselect: (value: string | undefined) => void;
	}

	let { name, values, disabledValues, selected, onselect }: Props = $props();
	let open = $state(false);
	let root: HTMLDivElement | null = null;

	const current = $derived(values.find((v) => v.value === selected));

	function toggle(): void {
		open = !open;
	}

	function choose(value: string | undefined): void {
		onselect(value);
		open = false;
	}

	function onwindowclick(event: MouseEvent): void {
		if (root && event.target instanceof Node && !root.contains(event.target)) open = false;
	}

	function onkeydown(event: KeyboardEvent): void {
		if (event.key === 'Escape') open = false;
	}
</script>

<svelte:window onclick={onwindowclick} />

<div class="relative" bind:this={root} onkeydown={onkeydown} role="presentation">
	<span class="mb-3 block text-sm"><span class="text-muted">{name}:</span> {selected ?? ''}</span>
	<button
		type="button"
		class="flex min-h-12 w-full items-stretch overflow-hidden rounded-(--radius-controls) border border-line p-0 text-left transition-colors hover:border-ink {open
			? 'rounded-b-none border-ink'
			: ''}"
		aria-haspopup="listbox"
		aria-expanded={open}
		onclick={toggle}
	>
		{#if current}
			<ValueSwatch value={current} label={current.value} />
			<span class="flex min-h-12 items-center px-4">{current.value}</span>
		{:else}
			<span class="flex min-h-12 items-center px-4 text-muted">Seleccioná uno</span>
		{/if}
		<svg class="mr-4 ml-auto self-center transition-transform {open ? 'rotate-180' : ''}" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
	</button>
	{#if open}
		<ul
			role="listbox"
			aria-label={name}
			class="absolute top-full z-10 max-h-64 w-full divide-y divide-line overflow-y-auto rounded-t-none rounded-b-(--radius-panels) border border-t-0 border-ink bg-paper"
		>
			{#if selected !== undefined}
				<li role="presentation">
					<button
						type="button"
						role="option"
						aria-selected={selected === undefined}
						class="flex w-full items-stretch p-0 text-left"
						onclick={() => choose(undefined)}
					>
						<span class="flex min-h-12 items-center px-4 text-muted">Seleccioná uno</span>
					</button>
				</li>
			{/if}
			{#each values.filter((v) => v.value !== selected) as v}
				<li role="presentation">
					<button
						type="button"
						role="option"
						aria-selected={selected === v.value}
						aria-disabled={disabledValues.includes(v.value)}
						disabled={disabledValues.includes(v.value)}
						class="flex w-full items-stretch overflow-hidden p-0 text-left hover:bg-surface {selected === v.value
						? 'bg-surface'
						: ''} {disabledValues.includes(v.value) ? 'cursor-not-allowed opacity-40' : ''}"
						onclick={() => choose(v.value)}
					>
						<ValueSwatch value={v} label={v.value} />
						<span class="self-center px-4 py-3">{v.value}</span>
					</button>
				</li>
			{/each}
		</ul>
	{/if}
</div>
