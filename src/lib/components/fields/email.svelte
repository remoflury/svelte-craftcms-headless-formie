<script lang="ts">
	import type { FieldProps } from '$lib/types/FormTypes.js';
	import Label from '../label.svelte';

	type Props = {
		item: FieldProps;
	};

	let { item }: Props = $props();

	const field = $derived(item?.displayName == 'Email' ? item : null);
</script>

{#if field}
	<div>
		<Label for={field.handle} required={field.required}>{field.label}</Label>
		<input
			type="email"
			id={field.handle}
			name={field.handle}
			placeholder={field.placeholder}
			required={field.required}
		/>
	</div>
{/if}
