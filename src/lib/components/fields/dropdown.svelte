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

	const field = $derived(item?.displayName == 'Dropdown' ? item : null);
	const error = $derived(formStore.errorByHandle(field?.handle));
</script>

{#if field}
	<div data-formie-field-dropdown class={field.cssClasses ?? ''}>
		<Label required={field.required} for={field.handle}>{field.label}</Label>

		<select
			name={field.handle}
			id={field.handle}
			required={field.required}
			aria-invalid={!!error}
			aria-errormessage={error}
			multiple={field.multi ? true : false}
		>
			{#each field.options as option (option.value)}
				<option value={option.value} selected={option.isDefault}>{option.label}</option>
			{/each}
		</select>

		<FieldError {error} />
	</div>
{/if}
