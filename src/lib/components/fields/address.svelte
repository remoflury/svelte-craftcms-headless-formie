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

	const field = $derived(item?.displayName == 'Address' ? item : null);
	const errorAddress1 = $derived(formStore.errorByHandle(`${field?.handle}.address1`));
	const errorAddress2 = $derived(formStore.errorByHandle(`${field?.handle}.address2`));
	const errorAddress3 = $derived(formStore.errorByHandle(`${field?.handle}.address3`));
	const errorCity = $derived(formStore.errorByHandle(`${field?.handle}.city`));
	const errorState = $derived(formStore.errorByHandle(`${field?.handle}.state`));
	const errorZip = $derived(formStore.errorByHandle(`${field?.handle}.zip`));
	const errorCountry = $derived(formStore.errorByHandle(`${field?.handle}.country`));
</script>

{#if field}
	<fieldset id={field.handle} data-formie-field-address class={field.cssClasses ?? ''}>
		<Label required={field.required} tag="legend">{field.label}</Label>
		{#each field.fields as subfield (subfield.id)}
			{#if subfield.displayName === 'Address1'}
				<div>
					<Label for="address1" required={subfield.required}>{subfield.label}</Label>
					<input
						class=""
						type="text"
						id="address1"
						name="{field.handle}-address1"
						placeholder={subfield.placeholder}
						required={subfield.required}
						value={subfield.defaultValue}
						aria-invalid={!!errorAddress1}
						aria-errormessage={errorAddress1}
					/>
					<FieldError error={errorAddress1} />
				</div>
			{/if}

			{#if subfield.displayName === 'Address2'}
				<div>
					<Label for="address2" required={subfield.required}>{subfield.label}</Label>

					<input
						type="text"
						id="address2"
						name="{field.handle}-address2"
						placeholder={subfield.placeholder}
						required={subfield.required}
						value={subfield.defaultValue}
						aria-invalid={!!errorAddress2}
						aria-errormessage={errorAddress2}
					/>
					<FieldError error={errorAddress2} />
				</div>
			{/if}

			{#if subfield.displayName === 'Address3'}
				<div>
					<Label for="address3" required={subfield.required}>{field.label}</Label>

					<input
						type="text"
						id="address3"
						name="{field.handle}-address3"
						placeholder={subfield.placeholder}
						required={subfield.required}
						value={subfield.defaultValue}
						aria-invalid={!!errorAddress3}
						aria-errormessage={errorAddress3}
					/>
					<FieldError error={errorAddress3} />
				</div>
			{/if}

			{#if subfield.displayName === 'AddressCity'}
				<div>
					<Label for="city" required={subfield.required}>{subfield.label}</Label>

					<input
						type="text"
						id="city"
						name="{field.handle}-city"
						placeholder={subfield.placeholder}
						required={subfield.required}
						value={subfield.defaultValue}
						aria-invalid={!!errorCity}
						aria-errormessage={errorCity}
					/>
					<FieldError error={errorCity} />
				</div>
			{/if}

			{#if subfield.displayName === 'AddressState'}
				<div>
					<Label for="state" required={subfield.required}>{subfield.label}</Label>

					<input
						type="text"
						id="state"
						name="{field.handle}-state"
						placeholder={subfield.placeholder}
						required={subfield.required}
						value={subfield.defaultValue}
						aria-invalid={!!errorState}
						aria-errormessage={errorState}
					/>
					<FieldError error={errorState} />
				</div>
			{/if}

			{#if subfield.displayName === 'AddressZip'}
				<div>
					<Label for="zip" required={subfield.required}>{subfield.label}</Label>

					<input
						type="text"
						id="zip"
						name="{field.handle}-zip"
						placeholder={subfield.placeholder}
						value={subfield.defaultValue}
						required={field.required}
						aria-invalid={!!errorZip}
						aria-errormessage={errorZip}
					/>
					<FieldError error={errorZip} />
				</div>
			{/if}

			{#if subfield.displayName === 'AddressCountry' && 'options' in subfield && subfield['options']}
				<div>
					<Label for="country" required={subfield.required}>{subfield.label}</Label>
					<select
						id="country"
						name="{field.handle}-country"
						required={field.required}
						aria-invalid={!!errorCountry}
						aria-errormessage={errorCountry}
					>
						{#each subfield.options as country (country.value)}
							<option value={country.value} selected={subfield.defaultValue == country.value}
								>{country.label}</option
							>
						{/each}
					</select>
					<FieldError error={errorCountry} />
				</div>
			{/if}
		{/each}
	</fieldset>
{/if}
