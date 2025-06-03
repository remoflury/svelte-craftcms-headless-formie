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

	const field = $derived(item?.displayName == 'Date' ? item : null);
	const error = $derived(formStore.errorByHandle(field?.handle));

	const type: 'time' | 'date' | 'datetime-local' | null = $derived.by(() => {
		const enabledFields = field?.nestedRows?.[0].rowFields?.filter((r) => r.enabled) || [];

		if (enabledFields.length == 0) return null;
		if (enabledFields.length == 1 && enabledFields[0].handle == 'date') return 'date';
		if (enabledFields.length == 1 && enabledFields[0].handle == 'time') return 'time';
		return 'datetime-local';
	});
</script>

{#if field && type}
	<div data-formie-field-date class={field.cssClasses ?? ''}>
		<Label required={field.required} for={field.handle}>{field.label}</Label>
		<input
			id={field.handle}
			{type}
			name={field.handle}
			value={field.defaultValue}
			min={field.minDate}
			max={field.maxDate}
			required={field.required}
			class="datePicker"
			aria-invalid={!!error}
			aria-errormessage={error}
		/>
		<FieldError {error} />
	</div>
{/if}

<style>
	.datePicker::-webkit-calendar-picker-indicator {
		position: absolute;
		right: 20px;
	}
</style>
