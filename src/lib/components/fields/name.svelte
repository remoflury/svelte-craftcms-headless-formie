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

	const field = $derived(item?.displayName == 'Name' ? item : null);
	const error = $derived(formStore.getErrorByHandle(field?.handle));
</script>

{#if field}
	<div data-formie-field-name class={field.cssClasses ?? ''}>
		{#if field.useMultipleFields}
			<fieldset id={field.handle}>
				{#each field.fields as block (block.label)}
					<Label required={block.required} for="{field.handle}-{block.handle}">{block.label}</Label>
					<input
						type="text"
						id={block.handle}
						name="{field.handle}-{block.handle}"
						placeholder={block.placeholder}
						required={field.required}
					/>
				{/each}
			</fieldset>
		{:else}
			<Label for={field.handle} required={field.required}>{field.label}</Label>
			<input
				type="text"
				id={field.handle}
				name={field.handle}
				placeholder={field.placeholder}
				required={field.required}
				aria-invalid={!!error}
				aria-errormessage={error}
			/>
			<FieldError {error} />
		{/if}
	</div>
{/if}
