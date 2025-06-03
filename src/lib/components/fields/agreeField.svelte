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

	const field = $derived(item?.displayName == 'Agree' ? item : null);
	const error = $derived(formStore.errorByHandle(field?.handle));
</script>

{#if field}
	<div data-formie-field-agree class={field.cssClasses ?? ''}>
		<Label required={field.required}>{field.label}</Label>
		{#if field.descriptionHtml}
			<p class="">
				<!-- eslint-disable-next-line -->
				{@html field.descriptionHtml}
			</p>
		{/if}
		<div class="">
			<input
				type="checkbox"
				name={field.handle}
				checked={field.defaultState}
				required={field.required}
				class="mt-0 aspect-square"
			/>
			<FieldError {error} />
		</div>
	</div>
{/if}

<style>
	input[type='checkbox'] {
		padding: 0 !important;
	}
</style>
