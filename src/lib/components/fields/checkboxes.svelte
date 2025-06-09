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

	const field = $derived(item?.displayName == 'Checkboxes' ? item : null);
	const error = $derived(formStore.getErrorByHandle(field?.handle));
</script>

{#if field}
	<fieldset data-formie-field-checkboxes class={field.cssClasses ?? ''}>
		<Label tag="legend" for={field.handle} required={field.required}>{field.label}</Label>
		{#each field.options as option, i (option.value)}
			<div
				class:opacity-60={option.disabled}
				class:cursor-pointer={option.disabled}
				class:cursor-not-allowed={!option.disabled}
			>
				<Label for="{field.handle}[]">{option.label}</Label>
				<input
					type="checkbox"
					class=""
					id="{field.handle}-{i}"
					name="{field.handle}[]"
					value={option.value}
					checked={option.isDefault}
					disabled={option.disabled}
					required={field.required}
					aria-invalid={!!error}
					aria-errormessage={error}
				/>
			</div>
		{/each}
		<FieldError {error} />
	</fieldset>
{/if}

<style lang="postcss">
	input[type='checkbox'] {
		padding: 0;
	}
</style>
