<script lang="ts">
	import type { FormStore } from '$lib/store.svelte.js';
	import type { CountryAllowed, FieldProps } from '$lib/types/FieldTypes.js';
	import FieldError from '../fieldError.svelte';
	import Label from '../label.svelte';

	type Props = {
		item: FieldProps;
		formStore: FormStore;
	};

	let { item, formStore }: Props = $props();

	const field = $derived(item?.displayName == 'Phone' ? item : null);
	const error = $derived(formStore.getErrorByHandle(field?.handle));

	const countryAllowed: CountryAllowed[] | undefined = $derived.by(() => {
		if (!field?.countryAllowed) return undefined;
		return JSON.parse(field.countryAllowed) as CountryAllowed[];
	});

	const selectableCountries = $derived.by(() => {
		if (countryAllowed && countryAllowed.length) return countryAllowed;
		if (field) return field.countryOptions;
		return [];
	});
</script>

{#if field}
	<div data-formie-field-phone class={field.cssClasses ?? ''}>
		<Label required={field.required} for={field.handle}>{field.label}</Label>
		<div>
			{#if field.countryEnabled}
				<select
					name="country"
					id="country"
					required={field.required}
					value={field.countryDefaultValue}
				>
					{#each selectableCountries as option (option.value)}
						<option value={option.value}>{option.label}</option>
					{/each}
				</select>
			{/if}
			<input
				type="tel"
				name={field.handle}
				placeholder={field.placeholder}
				required={field.required}
				min="1"
				step="1"
				aria-invalid={!!error}
				aria-errormessage={error}
			/>
			<FieldError {error} />
		</div>
	</div>
{/if}
