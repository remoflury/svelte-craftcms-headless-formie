<script lang="ts">
	import type { FieldProps } from '$lib/types/FormTypes.js';
	import Label from '../label.svelte';

	type Props = {
		item: FieldProps;
	};

	let { item }: Props = $props();

	const field = $derived(item?.displayName == 'Dropdown' ? item : null);
</script>

{#if field}
	<div data-formie-field-dropdown>
		<Label required={field.required} for={field.name}>{field.label}</Label>

		<select name={field.handle} id={field.name} required={field.required}>
			{#each field.options as option (option.value)}
				<option value={option.value} selected={option.isDefault}>{option.label}</option>
			{/each}
		</select>
	</div>
{/if}
