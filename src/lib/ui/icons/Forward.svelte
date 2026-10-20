<script lang="ts">
	interface Props {
		size?: number | string;
		color?: string;
		fill?: string;
		strokeWidth?: number | string;
	}

	let {
		size = 24,
		color = 'currentColor',
		fill = 'none',
		strokeWidth = 2,
		...rest
	}: Props = $props();
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	width={size}
	height={size}
	viewBox="0 0 24 24"
	fill={fill}
	stroke={color}
	stroke-width={strokeWidth}
	stroke-linecap="round"
	stroke-linejoin="round"
	class="lucide lucide-forward"
	{...rest}
>
	<path d="m15 17 5-5-5-5" />
	<path d="M4 18v-2a4 4 0 0 1 4-4h12" />
</svg>
