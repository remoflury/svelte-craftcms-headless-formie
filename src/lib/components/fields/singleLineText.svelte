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

	const field = $derived(item?.displayName == 'SingleLineText' ? item : null);
	const error = $derived(formStore.errorByHandle(field?.handle));
</script>

{#if field}
	<div data-formie-single-line-text class={field.cssClasses ?? ''}>
		<Label required={field.required} for={field.handle}>{field.label}</Label>
		<input
			type="text"
			id={field.handle}
			name={field.handle}
			placeholder={field.placeholder}
			required={field.required}
			aria-invalid={!!error}
			aria-errormessage={error}
		/>
		<FieldError {error} />
	</div>
{/if}
