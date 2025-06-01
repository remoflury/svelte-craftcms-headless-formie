<script lang="ts">
	import type { FieldProps } from '$lib/types/FieldTypes.js';
	import { type Component } from 'svelte';

	type Props = {
		field: FieldProps;
		updateFormFields: (handle: string, newValue: string) => void;
	};

	let { field, updateFormFields }: Props = $props();

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
		Component<{ item: FieldProps; updateFormFields: (handle: string, newValue: string) => void }>
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
		Heading: Heading
	};
</script>

{#if field.displayName && componentMap[field.displayName]}
	{@const Field: Component<{ item: FieldProps; updateFormFields: (handle: string, newValue: string) => void }> = componentMap[field.displayName]}
	<Field item={field} {updateFormFields} />
{/if}
