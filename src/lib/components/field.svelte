<script lang="ts">
	import type { FieldProps } from '$lib/types/FieldTypes.js';
	import type { FormStore } from '$lib/store.svelte.js';
	import { getContext, type Component } from 'svelte';

	type Props = {
		field: FieldProps;
		formStore: FormStore;
		updateFormFields: (handle: string, newValue: string) => void;
	};

	let { field, updateFormFields, formStore }: Props = $props();

	/**
	 *
	 * Component of the fields
	 *
	 * @description
	 * All the Components used forms
	 *
	 */
	import AgreeField from './fields/agreeField.svelte';
	import Address from './fields/address.svelte';
	import SingleLineText from './fields/singleLineText.svelte';
	import Radio from './fields/radio.svelte';
	import MultiLineText from './fields/multiLineText.svelte';
	import Checkboxes from './fields/checkboxes.svelte';
	import Dropdown from './fields/dropdown.svelte';
	import Number from './fields/number.svelte';
	import Name from './fields/name.svelte';
	import Email from './fields/email.svelte';
	import Phone from './fields/phone.svelte';
	import Date from './fields/date.svelte';
	import Heading from './fields/heading.svelte';
	import FileUpload from './fields/fileUpload.svelte';
	import { FORMIE_CONTEXT_KEY } from '$lib/utils/constants.js';
	import type { FormieOptions } from '$lib/index.js';

	/**
	 *
	 * componentMap
	 *
	 * @description
	 * This componentMap is used to map the field typeHandle to the correct component
	 * All compoents in the Map need to require the item Prop with the type field
	 *
	 */
	const componentMap: Record<
		string,
		Component<{
			item: FieldProps;
			updateFormFields: (handle: string, newValue: string) => void;
			formStore: FormStore;
		}>
	> = {
		SingleLineText: SingleLineText,
		Radio: Radio,
		MultiLineText: MultiLineText,
		Checkboxes: Checkboxes,
		Dropdown: Dropdown,
		Number: Number,
		Name: Name,
		Email: Email,
		Phone: Phone,
		Agree: AgreeField,
		Date: Date,
		Address: Address,
		Heading: Heading,
		FileUpload: FileUpload
	};

	const options: FormieOptions = getContext(FORMIE_CONTEXT_KEY);

	const isFieldSupported: boolean = $derived.by(() => {
		if (!options || !('supportedFields' in options) || !options.supportedFields?.length) {
			return true;
		}

		if (options.supportedFields.includes(field.displayName)) return true;

		return false;
	});
</script>

{#if field.displayName && componentMap[field.displayName] && isFieldSupported}
	{@const Field: Component<{ item: FieldProps; updateFormFields: (handle: string, newValue: string) => void; formStore: FormStore }> = componentMap[field.displayName]}
	<Field item={field} {updateFormFields} {formStore} />
{/if}
