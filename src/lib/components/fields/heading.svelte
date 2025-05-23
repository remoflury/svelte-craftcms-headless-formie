<script lang="ts">
	import type { FieldProps } from '$lib/types/FormTypes.js';

	type Props = {
		item: FieldProps;
	};

	let { item }: Props = $props();

	const field = $derived(item?.displayName == 'Heading' ? item : null);
</script>

{#if field}
	{#if field.headingSize === 'h1'}
		<h1 class="">{field.label}</h1>
	{:else if field.headingSize === 'h2'}
		<h2 class="">{field.label}</h2>
	{:else if field.headingSize === 'h3'}
		<h3 class="">{field.label}</h3>
	{:else if field.headingSize === 'h4'}
		<h4 class="">{field.label}</h4>
	{:else if field.headingSize === 'h5'}
		<h5 class="">{field.label}</h5>
	{:else if field.headingSize === 'h6'}
		<h6 class="">{field.label}</h6>
	{/if}
{/if}
