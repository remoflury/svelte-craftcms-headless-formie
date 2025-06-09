<script lang="ts">
	import type { FormStore } from '$lib/store.svelte.js';
	import type { FieldProps } from '$lib/types/FieldTypes.js';
	import { getAllowedFileTypes } from '$lib/utils/mutationUtils.js';
	import FieldError from '../fieldError.svelte';
	import Label from '../label.svelte';

	type Props = {
		item: FieldProps;
		formStore: FormStore;
	};

	let { item, formStore }: Props = $props();

	const field = $derived(item?.displayName == 'FileUpload' ? item : null);
	const error = $derived(formStore.errorByHandle(field?.handle));

	$inspect(item);

	/**
	 * ========================
	 * 				functions
	 * ========================
	 */

	/**
	 * @function convertFileSizeToMb
	 * @param input
	 */

	//  const streamToText = async (blob) => {
	//     const readableStream = await blob.getReader();
	//     const chunk = await readableStream.read();

	//     return new TextDecoder('utf-8').decode(chunk.value);
	//   };

	//   const bufferToText = (buffer) => {
	//     const bufferByteLength = buffer.byteLength;
	//     const bufferUint8Array = new Uint8Array(buffer, 0, bufferByteLength);

	//     return new TextDecoder().decode(bufferUint8Array);
	//   };
</script>

{#if field}
	<div data-formie-field-fileupload class={field.cssClasses ?? ''}>
		<Label for={field.handle} required={field.required}>{field.label}</Label>
		<input
			type="file"
			id={field.handle}
			name={field.handle}
			placeholder={field.placeholder}
			required={field.required}
			aria-invalid={!!error}
			aria-errormessage={error}
			value={field.defaultValue}
			accept={getAllowedFileTypes(field.allowedKinds || [])}
		/>
		<FieldError {error} />
	</div>
{/if}
