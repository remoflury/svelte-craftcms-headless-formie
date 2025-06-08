<script lang="ts">
	import type { AfterSubmitState, FormieFormProps } from '$lib/types/ComponentTypes.js';
	import { addRecaptcha, areInputFieldsValid, checkFieldConditions } from '$lib/utils/formUtils.js';
	import { load, type ReCaptchaInstance } from 'recaptcha-v3';
	import { onMount } from 'svelte';
	import { getFormMutation, getMutationVariables } from '$lib/utils/mutationUtils.js';
	import { FormQuery } from '$lib/queries/FormQuery.js';
	import { recaptchaHintSnippet } from './recaptchaHintSnippet.svelte';
	import Field from './field.svelte';
	import type {
		CraftGraphQlErrorProps,
		FormField,
		FormieFetchDataProps,
		FormieFetchProps,
		FormiePagesProps
	} from '$lib/types/FormTypes.js';
	import { FormStore } from '$lib/store.svelte.js';

	let {
		handle,
		errorSnippet,
		skeletonSnippet,
		onaftersubmit,
		isLoading = $bindable(false),
		afterSubmitSnippet,
		recaptchaHint = recaptchaHintSnippet,
		submitButton,
		recaptchaKey,
		publicCmsApi,
		siteId: submitToSiteId = undefined,
		pagination,
		...rest
	}: FormieFormProps = $props();

	const variables = $derived({
		handle
	});

	let formFields: FormField[] = $state([]);
	let pageIndex = $state(0);
	let formData: FormieFetchProps = $state({ data: undefined, errors: undefined });
	let pages: FormiePagesProps[] = $state([]);
	let form: HTMLFormElement | undefined = $state();
	let recaptcha: ReCaptchaInstance | undefined = $state();
	let formStore = new FormStore();
	let formId = $derived(`${crypto.randomUUID()}-${formData?.data?.form.handle}`);
	let afterSubmitState: AfterSubmitState | undefined = $state(undefined);
	let submitButtonText: string | undefined = $state(undefined);

	const query: string = FormQuery?.loc?.source?.body ?? '';

	let options = $derived({
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ query, variables })
	});

	/**
	 * Updates the value of a form field identified by its handle.
	 *
	 * This function iterates over the global `formFields` array and, for each field
	 * whose `handle` matches the provided identifier, sets its `value` to `newValue`.
	 * Other fields remain unchanged.
	 *
	 * @param {string} handle - The unique handle of the form field to update.
	 * @param {string} newValue - The new value to assign to the matched form field.
	 * @returns {void}
	 *
	 */
	const updateFormFields = (handle: string, newValue: string) => {
		formFields = formFields.map((field) => {
			if (field.handle === handle) {
				field.value = newValue;
			}
			return field;
		});
	};

	const fetchData = $derived(async () => {
		const response = await fetch(publicCmsApi, options);
		const { data, errors }: FormieFetchProps = await response.json();

		formData = { data, errors };
		if (data) {
			pages = data.form.pages;
			formFields = data.form.pages.flatMap((page) =>
				page.rows.flatMap((row) =>
					row.rowFields.flatMap((field) => [{ handle: field.handle, value: '' }])
				)
			);
		}

		if (errors) {
			console.error(errors);
			throw new Error(errors[0].message);
		}
	});

	const onSubmit = $derived(
		async (
			e: SubmitEvent,
			formData: Exclude<FormieFetchDataProps, undefined>,
			siteId: number | string | undefined
		) => {
			// return early if recaptcha instance is not present and there is a recaptcha key
			if (!recaptcha && recaptchaKey) return;
			afterSubmitState = undefined;
			e.preventDefault();
			isLoading = true;

			if (!areInputFieldsValid(pages, pageIndex)) return;
			formStore.clearErrors(); //clear the errorStates
			addRecaptcha(recaptcha, formData, recaptchaKey);

			const formMutation = getFormMutation(formData.form, siteId);
			const formDataVariables = await getMutationVariables(formData.form, form);

			const response = await fetch(publicCmsApi, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					query: formMutation.loc?.source.body,
					variables: formDataVariables
				})
			});
			const { data, errors }: { data: unknown; errors: CraftGraphQlErrorProps[] } =
				await response.json();

			if (data && !errors) {
				afterSubmitState = {
					message: formData?.form?.settings?.submitActionMessageHtml,
					isSuccess: true
				};
			} else {
				const errorMessages: Record<string, string[]> = JSON.parse(
					errors[0].message.replaceAll("'", '')
				);
				formStore.errors = errorMessages;
				console.error('Error', errorMessages);

				console.log(errors);

				afterSubmitState = {
					message: formData?.form?.settings?.errorMessageHtml,
					isSuccess: false
				};
			}
			onaftersubmit?.($state.snapshot(afterSubmitState));
			isLoading = false;
		}
	);

	/**
	 * @function goToFormPage
	 * @description
	 * goes to a given site by index
	 *
	 * @param targetIndex
	 * @returns void
	 */
	const goToFormPage = (targetIndex: number) => {
		if (targetIndex < 0 || targetIndex === pageIndex || targetIndex > pages.length) return;
		if (!areInputFieldsValid(pages, pageIndex)) return;
		pageIndex = targetIndex;
	};

	onMount(async () => {
		if (!recaptchaKey) return;
		recaptcha = await load(recaptchaKey, { autoHideBadge: true });
	});

	// update all values if either page index changes or formData changes
	$effect(() => {
		if (pageIndex >= 0 && formData && formData?.data) {
			submitButtonText = formData.data?.form.pages[pageIndex].settings.submitButtonLabel;
		}
	});
</script>

<!-- 
@component FormieForm
A Formie Form Component, which can be used to make form submissions to
Craft CMS's formie plugin in headless configuration.

Usage:
  ```svelte
  <FormieForm handle="your-form-handle" publicCmsApi={PUBLIC_CMS_API} />
  ```
-->

{#await fetchData()}
	{#if skeletonSnippet}
		{@render skeletonSnippet()}
	{/if}
{:then}
	{#if formData && formData.data}
		<form
			bind:this={form}
			id={formId}
			onsubmit={async (e) => await onSubmit(e, formData.data!, submitToSiteId)}
			data-formie-form
			{...rest}
		>
			{#each formData.data.form.pages as page, i (page.id)}
				<div id={page.id} class:hidden={i !== pageIndex} data-formie-page={page.id}>
					{#if page.rows.length > 0}
						<!-- eslint-disable-next-line -->
						{#each page.rows as row (crypto.randomUUID())}
							<!-- eslint-disable-next-line -->
							{#each row.rowFields as field (crypto.randomUUID())}
								{#if checkFieldConditions(field.conditions, formFields)}
									<div data-formie-field>
										<Field {field} {updateFormFields} {formStore} />
									</div>
								{/if}
							{/each}
						{/each}
					{/if}
				</div>
			{/each}

			{#if !afterSubmitState?.isSuccess && pages.length > 1}
				{@render pagination?.({
					currentIndex: pageIndex,
					totalPages: pages.length,
					backBtn: {
						text: pages[pageIndex].settings.backButtonLabel,
						onclick: () => goToFormPage?.(pageIndex - 1)
					},
					nextBtn: {
						text: pages[pageIndex].settings.submitButtonLabel,
						onclick: () => goToFormPage?.(pageIndex + 1)
					}
				})}
			{/if}
			{#if !afterSubmitState?.isSuccess && pageIndex + 1 === pages.length && submitButtonText}
				{@render submitButton({ text: submitButtonText })}
			{/if}

			{#if afterSubmitSnippet && afterSubmitState}
				{@render afterSubmitSnippet({ state: afterSubmitState })}
			{/if}
		</form>
		{#if recaptchaKey}
			{@render recaptchaHint?.()}
		{/if}
	{/if}
{:catch}
	{#if errorSnippet}
		{@render errorSnippet()}
	{/if}
{/await}

<style>
	.hidden {
		display: none;
	}
</style>
