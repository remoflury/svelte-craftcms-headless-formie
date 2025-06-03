<script lang="ts">
	import type { FormStore } from '$lib/store.svelte.js';
	import type { FieldProps } from '$lib/types/FieldTypes.js';
	import FieldError from '../fieldError.svelte';
	import Label from '../label.svelte';

	type Props = {
		item: FieldProps;
		formStore: FormStore;
	};

	let { item, formStore }: Props = $props();

	const field = $derived(item?.displayName == 'Number' ? item : null);
	const error = $derived(formStore.errorByHandle(field?.handle));
</script>

{#if field}
	<div data-formie-field-number class={field.cssClasses ?? ''}>
		<Label for={field.handle} required={field.required}>{field.label}</Label>

		<input
			type="number"
			id={field.handle}
			name={field.handle}
			placeholder={field.placeholder}
			required={field.required}
			min={field.minValue !== null ? field.minValue : undefined}
			max={field.maxValue !== null ? field.maxValue : undefined}
			aria-invalid={!!error}
			aria-errormessage={error}
		/>
		<FieldError {error} />
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
