<script lang="ts">
	import type { FieldProps } from '$lib/types/FieldTypes.js';
	import Label from '../label.svelte';

	type Props = {
		item: FieldProps;
	};

	let { item }: Props = $props();

	const field = $derived(item?.displayName == 'Agree' ? item : null);
</script>

{#if field}
	<div data-formie-field-agree class={field.cssClasses ?? ''}>
		<Label required={field.required}>{field.label}</Label>
		<div class="">
			<input
				type="checkbox"
				name={field.handle}
				checked={field.defaultState}
				required={field.required}
				class="mt-0 aspect-square"
			/>
			<p class="">
				<!-- eslint-disable-next-line -->
				{@html field.descriptionHtml}
			</p>
		</div>
	</div>
{/if}

<style>
	input[type='checkbox'] {
		padding: 0 !important;
	}
</style>
