<script lang="ts">
	import type { FieldProps } from '$lib/types/FieldTypes.js';
	import Label from '../label.svelte';

	type Props = {
		item: FieldProps;
	};

	let { item }: Props = $props();

	const field = $derived(item?.displayName == 'SingleLineText' ? item : null);
</script>

{#if field}
	<div data-formie-single-line-text class={field.cssClasses ?? ''}>
		<Label required={field.required}>{field.label}</Label>
		<input
			type="text"
			id={field.handle}
			name={field.handle}
			placeholder={field.placeholder}
			required={field.required}
		/>
	</div>
{/if}
