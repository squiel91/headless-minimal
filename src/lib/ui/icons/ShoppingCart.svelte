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
	class="lucide lucide-shopping-cart"
	{...rest}
>
	<path d="m2.05 2.05 1.099-.028a1 1 0 0 1 1.008.815l2.69 14.347A1 1 0 0 0 7.83 18H18" />
	<path d="M4.563 5h16.435a1 1 0 0 1 .981 1.204l-1.026 6.226A2 2 0 0 1 18.962 14H6.25" />
	<circle cx="18" cy="20" r="2" />
	<circle cx="8" cy="20" r="2" />
</svg>
