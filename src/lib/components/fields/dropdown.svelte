<script lang="ts">
	import type { FieldProps } from '$lib/types/FieldTypes.js';
	import Label from '../label.svelte';

	type Props = {
		item: FieldProps;
	};

	let { item }: Props = $props();

	const field = $derived(item?.displayName == 'Dropdown' ? item : null);
</script>

{#if field}
	<div data-formie-field-dropdown class={field.cssClasses ?? ''}>
		<Label required={field.required} for={field.handle}>{field.label}</Label>

		<select name={field.handle} id={field.handle} required={field.required}>
			{#each field.options as option (option.value)}
				<option value={option.value} selected={option.isDefault}>{option.label}</option>
			{/each}
		</select>
	</div>
{/if}
