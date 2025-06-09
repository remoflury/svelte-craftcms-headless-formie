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
	const error = $derived(formStore.getErrorByHandle(field?.handle));
	let inputEl: HTMLInputElement | undefined = $state();
	let files: FileList | undefined = $state();
	const multipleAllowed: true | undefined = $derived.by(() => {
		if (!field) return undefined;
		if (field.limitFiles !== null && parseInt(field.limitFiles) == 0) return undefined;
		return true;
	});

	/**
	 * ========================
	 * 				functions
	 * ========================
	 */

	/**
	 * @function convertFileSizeToMb
	 * @param input
	 * @returns number | undefined
	 */
	const convertFileSizeToMb = (input: number): number => {
		return input * 1024 * 1024;
	};

	/**
	 * @function handleChange
	 * @desription
	 * when a file is inserted, it is checked wether the min or max file size applies
	 * applies errorHandling with the form store
	 * @param minFileSize
	 * @param maxFileSize
	 * @param maxFileCount
	 * @returns void
	 */
	const handleChange = () => {
		formStore.clearErrors();
		if (!field) return;
		if (!files) return;
		if (!field.sizeMinLimit && !field.sizeLimit && !field.limitFiles) return;
		const fileLimit = field.limitFiles ? parseInt(field.limitFiles) : null;
		const sizeMinLimit = field.sizeMinLimit ? parseInt(field.sizeMinLimit) : null;
		const sizeLimit = field.sizeLimit ? parseInt(field.sizeLimit) : null;

		// check for maximum file limits
		if (fileLimit && files.length > fileLimit) {
			formStore.setErrorByHandle(field.handle, `Max. Files: ${fileLimit}`);
			clearInputField();

			return;
		}

		// check for minimum file size
		if (sizeMinLimit) {
			[...files].forEach((file) => {
				if (file.size < convertFileSizeToMb(sizeMinLimit)) {
					formStore.setErrorByHandle(field.handle, `Min. File Size: ${sizeMinLimit}MB`);
					clearInputField();

					return;
				}
			});
		}
		if (sizeLimit) {
			[...files].forEach((file) => {
				if (file.size > convertFileSizeToMb(sizeLimit)) {
					formStore.setErrorByHandle(field.handle, `Max. File Size: ${sizeLimit}MB`);
					clearInputField();
					return;
				}
			});
		}
	};

	/**
	 * @function clearInputField
	 * @description
	 * manually sets the input fields values to empty
	 */
	const clearInputField = () => {
		if (inputEl) inputEl.value = '';
		files = undefined;
	};
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
			accept={getAllowedFileTypes(field.allowedKinds || [])}
			multiple={multipleAllowed}
			bind:files
			bind:this={inputEl}
			onchange={handleChange}
		/>
		<FieldError {error} />
	</div>
{/if}
