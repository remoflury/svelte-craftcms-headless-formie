<script lang="ts">
	import type { FieldProps } from '$lib/types/FieldTypes.js';
	import Label from '../label.svelte';

	type Props = {
		item: FieldProps;
	};
	let { item }: Props = $props();

	const field = $derived(item?.displayName == 'Checkboxes' ? item : null);
</script>

{#if field}
	<fieldset data-formie-field-checkboxes class={field.cssClasses ?? ''}>
		<Label for={field.handle} required={field.required}>{field.label}</Label>
		{#each field.options as option, i (option.value)}
			<div
				class=""
				class:opacity-60={option.disabled}
				class:cursor-pointer={option.disabled}
				class:cursor-not-allowed={!option.disabled}
			>
				<Label for="{field.handle}[]" class="!font-normal">{option.label}</Label>
				<input
					type="checkbox"
					class="mt-0"
					id="{field.handle}-{i}"
					name="{field.handle}[]"
					value={option.value}
					checked={option.isDefault}
					disabled={option.disabled}
				/>
				<!-- required={field.required} -->
			</div>
		{/each}
	</fieldset>
{/if}

<style lang="postcss">
	input[type='checkbox'] {
		padding: 0;
	}
</style>
