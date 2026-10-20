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
	class="lucide lucide-arrow-right"
	{...rest}
>
	<path d="M5 12h14" />
	<path d="m12 5 7 7-7 7" />
</svg>
