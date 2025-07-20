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

	const field = $derived(item?.displayName == 'Hidden' ? item : null);
	const error = $derived(formStore.getErrorByHandle(field?.handle));

	$inspect(field);
</script>

{#if field}
	<div data-formie-field-hidden class={field.cssClasses ?? ''}>
		<Label for={field.handle} required={field.required} hidden>{field.label}</Label>
		<input
			type="text"
			id={field.handle}
			name={field.handle}
			placeholder={field.placeholder}
			required={field.required}
			aria-invalid={!!error}
			aria-errormessage={error}
			value={field.defaultValue}
			hidden
		/>
		<FieldError {error} />
	</div>
{/if}
