<script lang="ts">
	import type { FormStore } from '$lib/store.svelte.js';
	import type { FieldProps } from '$lib/types/FieldTypes.js';
	import FieldError from '../fieldError.svelte';
	import Label from '../label.svelte';

	type Props = {
		item: FieldProps;
		updateFormFields: (handle: string, newValue: string) => void;
		formStore: FormStore;
	};

	let { item, updateFormFields, formStore }: Props = $props();

	const field = $derived(item?.displayName == 'Radio' ? item : null);
	const error = $derived(formStore.errorByHandle(field?.handle));

	let group: string = $state('');

	$effect(() => {
		field?.options.forEach((option) => {
			if (option.isDefault) {
				group = option.value;
			}
		});
	});
</script>

{#if field}
	<fieldset data-formie-field-radio class={field.cssClasses ?? ''}>
		<Label tag="legend" required={field.required} for={field.handle}>{field.label}</Label>
		{#each field.options as option, i (option.value)}
			<div
				class:opacity-60={option.disabled}
				class:cursor-pointer={option.disabled}
				class:cursor-not-allowed={!option.disabled}
			>
				<Label for="{field.handle}-{i}" class="!font-normal ">{option.label}</Label>
				<input
					type="radio"
					id="{field.handle}-{i}"
					name={field.handle}
					value={option.value}
					checked={option.isDefault}
					bind:group
					disabled={option.disabled}
					onchange={() => {
						updateFormFields(field.handle, group);
					}}
					required={field.required}
				/>
			</div>
		{/each}
		<FieldError {error} />
	</fieldset>
{/if}

<style>
	input[type='radio'] {
		aspect-ratio: 1/1;
		padding: 0.125rem !important;
	}
</style>
