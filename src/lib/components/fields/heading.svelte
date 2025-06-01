<script lang="ts">
	import type { FieldProps } from '$lib/types/FieldTypes.js';

	type Props = {
		item: FieldProps;
	};

	let { item }: Props = $props();

	const field = $derived(item?.displayName == 'Heading' ? item : null);
</script>

{#if field}
	{#if field.headingSize === 'h1'}
		<h1 data-formie-field-heading class={field.cssClasses ?? ''}>{field.label}</h1>
	{:else if field.headingSize === 'h2'}
		<h2 data-formie-field-heading class={field.cssClasses ?? ''}>{field.label}</h2>
	{:else if field.headingSize === 'h3'}
		<h3 data-formie-field-heading class={field.cssClasses ?? ''}>{field.label}</h3>
	{:else if field.headingSize === 'h4'}
		<h4 data-formie-field-heading class={field.cssClasses ?? ''}>{field.label}</h4>
	{:else if field.headingSize === 'h5'}
		<h5 data-formie-field-heading class={field.cssClasses ?? ''}>{field.label}</h5>
	{:else if field.headingSize === 'h6'}
		<h6 data-formie-field-heading class={field.cssClasses ?? ''}>{field.label}</h6>
	{/if}
{/if}
