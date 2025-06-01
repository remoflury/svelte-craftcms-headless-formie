<script lang="ts">
	import type { FieldProps } from '$lib/types/FieldTypes.js';
	import Label from '../label.svelte';

	type Props = {
		item: FieldProps;
	};

	let { item }: Props = $props();

	const field = $derived(item?.displayName == 'MultiLineText' ? item : null);
</script>

{#if field}
	<div data-formie-field-multi-line-text class={field.cssClasses ?? ''}>
		<Label for={field.handle} required={field.required}>{field.label}</Label>
		{#if field.instructions}
			<small>{field.instructions}</small>
		{/if}
		<textarea
			id={field.handle}
			name={field.handle}
			placeholder={field.placeholder}
			rows="4"
			cols="50"
			required={field.required}
		></textarea>
	</div>
{/if}
