<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	type Props = HTMLAttributes<HTMLLegendElement | HTMLLabelElement> & {
		tag?: 'label' | 'legend';
		required?: boolean;
		for?: string;
	};

	let {
		tag = 'label',
		for: forAttr = '',
		required = false,
		children,
		...restProps
	}: Props = $props();
</script>

<svelte:element this={tag} {...restProps} for={forAttr}>
	{@render children?.()}
	{#if required}
		<sup class="text-red-300"> *</sup>
	{/if}
</svelte:element>
