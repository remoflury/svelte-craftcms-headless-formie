<script lang="ts">
	import type { FieldProps } from '$lib/types/FormTypes.js';
	import Label from '../label.svelte';

	type Props = {
		item: FieldProps;
	};

	let { item }: Props = $props();

	const field = $derived(item?.displayName == 'Number' ? item : null);
</script>

{#if field}
	<div data-formie-field-number>
		<Label for={field.handle} required={field.required}>{field.label}</Label>

		<input
			type="number"
			id={field.handle}
			name={field.handle}
			placeholder={field.placeholder}
			required={field.required}
			min={field.min}
			max={field.max !== 0 ? field.max : undefined}
		/>
	</div>
{/if}

<style>
	/* Chrome, Safari, Edge, Opera */
	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	/* Firefox */
	input[type='number'] {
		appearance: textfield;
		-moz-appearance: textfield;
	}
</style>
