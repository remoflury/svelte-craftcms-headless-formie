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

	const field = $derived(item?.displayName == 'MultiLineText' ? item : null);
	const error = $derived(formStore.getErrorByHandle(field?.handle));
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
			value={field.defaultValue}
			rows="4"
			cols="50"
			required={field.required}
			aria-invalid={!!error}
			aria-errormessage={error}
			minlength={field.limit && field.min ? field.min : undefined}
			maxlength={field.limit && field.max ? field.max : undefined}
		></textarea>

		<FieldError {error} />
	</div>
{/if}
