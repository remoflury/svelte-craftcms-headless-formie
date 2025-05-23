<script lang="ts">
	import type { FieldProps } from '$lib/types/FormTypes.js';
	import Label from '../label.svelte';

	type Props = {
		item: FieldProps;
		updateFormFields: (handle: string, newValue: string) => void;
	};

	let { item, updateFormFields }: Props = $props();

	const field = $derived(item?.displayName == 'Radio' ? item : null);

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
	<div data-formie-field-radio>
		<Label required={field.required} for={field.handle}>{field.label}</Label>
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
					required={field.required}
					disabled={option.disabled}
					onchange={() => {
						updateFormFields(field.handle, group);
					}}
				/>
			</div>
		{/each}
	</div>
{/if}

<style>
	input[type='radio'] {
		aspect-ratio: 1/1;
		padding: 0.125rem !important;
	}
</style>
