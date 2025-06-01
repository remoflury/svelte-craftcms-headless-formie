<script lang="ts">
	import type { AddressFieldProps, FieldProps } from '$lib/types/FieldTypes.js';
	import Label from '../label.svelte';

	type Props = {
		item: FieldProps;
	};

	let { item }: Props = $props();

	const field = $derived(item?.displayName == 'Address' ? item : null);

	const createPlaceholder = (field: AddressFieldProps['fields'][number]) => {
		let placeholder = field.placeholder;
		if (placeholder === null) {
			placeholder = field.label;
		}
		if (field.required) {
			placeholder += ' *';
		}
		return placeholder;
	};
</script>

{#if field}
	<fieldset id={field.handle} data-formie-field-address class={field.cssClasses ?? ''}>
		<Label required={field.required} tag="legend">{field.label}</Label>
		{#each field.fields as subfield (subfield.id)}
			{#if subfield.displayName === 'Address1'}
				<input
					class=""
					type="text"
					id="address1"
					name="{field.handle}-address1"
					placeholder={createPlaceholder(subfield)}
					required={subfield.required}
				/>
			{/if}

			{#if subfield.displayName === 'Address2'}
				<input
					type="text"
					id="address2"
					name="{field.handle}-address2"
					placeholder={createPlaceholder(subfield)}
					required={subfield.required}
				/>
			{/if}

			{#if subfield.displayName === 'Address3'}
				<input
					type="text"
					id="address3"
					name="{field.handle}-address3"
					placeholder={createPlaceholder(subfield)}
					required={field.required}
				/>
			{/if}

			{#if subfield.displayName === 'AddressCity'}
				<input
					type="text"
					id="city"
					name="{field.handle}-city"
					placeholder={createPlaceholder(subfield)}
					required={field.required}
				/>
			{/if}

			{#if subfield.displayName === 'AddressState'}
				<input
					type="text"
					id="state"
					name="{field.handle}-state"
					placeholder={createPlaceholder(subfield)}
					required={field.required}
				/>
			{/if}

			{#if subfield.displayName === 'AddressZip'}
				<input
					type="text"
					id="zip"
					name="{field.handle}-zip"
					placeholder={createPlaceholder(subfield)}
					required={field.required}
				/>
			{/if}

			{#if subfield.displayName === 'AddressCountry' && 'options' in subfield && subfield['options']}
				<select id="country" name="{field.handle}-country" required={field.required}>
					{#each subfield.options as country (country.value)}
						<option value={country.value} selected={'CH' == country.value}>{country.label}</option>
					{/each}
				</select>
			{/if}
		{/each}
	</fieldset>
{/if}
