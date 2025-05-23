<script lang="ts">
	import type { FieldProps } from '$lib/types/FormTypes.js';
	import Label from '../label.svelte';

	type Props = {
		item: FieldProps;
	};

	let { item }: Props = $props();

	const field = $derived(item?.displayName == 'Date' ? item : null);

	let input: HTMLInputElement | undefined = $state();
</script>

{#if field}
	<div data-formie-field-date>
		<Label required={field.required} for={field.handle}>{field.label}</Label>
		<input
			bind:this={input}
			id={field.handle}
			type="date"
			name={field.handle}
			placeholder={field.placeholder || 'dd / mm / yyyy'}
			required={field.required}
			class="datePicker"
		/>
	</div>
{/if}

<style>
	.datePicker::-webkit-calendar-picker-indicator {
		position: absolute;
		right: 20px;
	}
</style>
