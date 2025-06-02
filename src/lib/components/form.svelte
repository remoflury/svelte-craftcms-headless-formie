<script lang="ts">
	import type { AfterSubmitState } from '$lib/types/ComponentTypes.js';
	import {
		addRecaptcha,
		areInputFieldsValid,
		checkFieldConditions,
		setAriaInvalid
	} from '$lib/utils/formUtils.js';
	import { load, type ReCaptchaInstance } from 'recaptcha-v3';
	import { onMount, type Snippet } from 'svelte';
	import { getFormMutation, getMutationVariables } from '$lib/utils/mutationUtils.js';
	import { FormQuery } from '$lib/queries/FormQuery.js';
	import { recaptchaHintSnippet } from './recaptchaHintSnippet.svelte';
	import Field from './field.svelte';
	import type { HTMLFormAttributes } from 'svelte/elements';
	import type {
		CraftGraphQlErrorProps,
		FormField,
		FormieFetchDataProps,
		FormieFetchProps,
		FormiePagesProps
	} from '$lib/types/FormTypes.js';

	type Props = HTMLFormAttributes & {
		handle: string;
		submitButton: Snippet;
		submitButtonText?: string;
		isLoading?: boolean;
		onsuccessfulsubmit?: (message: string | null) => void;
		onerror?: (message: string | null) => void;
		skeletonSnippet?: Snippet;
		errorSnippet?: Snippet;
		afterSubmitState?: AfterSubmitState;
		afterSubmitSnippet?: Snippet; // component, which can be shown after submission
		recaptchaHint?: Snippet;
		recaptchaKey?: string;
		publicCmsApi: string;
		siteId?: string | number;
	};
	let {
		handle,
		onsuccessfulsubmit,
		onerror,
		errorSnippet,
		skeletonSnippet,
		isLoading = $bindable(false),
		afterSubmitSnippet,
		recaptchaHint = recaptchaHintSnippet,
		submitButton,
		recaptchaKey,
		publicCmsApi,
		submitButtonText = $bindable(''),
		afterSubmitState = $bindable(undefined),
		siteId: submitToSiteId = undefined,
		...rest
	}: Props = $props();

	const variables = $derived({
		handle
	});

	let formFields: FormField[] = $state([]);
	let pageIndex = $state(0);
	let formData: FormieFetchProps = $state({ data: undefined, errors: undefined });
	let pages: FormiePagesProps[] = $state([]);
	let form: HTMLFormElement | undefined = $state();
	let recaptcha: ReCaptchaInstance | undefined = $state();

	const query: string = FormQuery?.loc?.source?.body;

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
			afterSubmitState = undefined;
			e.preventDefault();
			isLoading = true;
			// return early if recaptcha instance is not present and there is a recaptcha key
			if (!recaptcha && recaptchaKey) return;

			if (!areInputFieldsValid(pages, pageIndex)) return;

			addRecaptcha(recaptcha, formData, recaptchaKey);

			const formMutation = getFormMutation(formData?.form, siteId);
			const formDataVariables = await getMutationVariables(formData?.form, form);

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
				onsuccessfulsubmit?.(afterSubmitState.message);
			} else {
				const errorMessages: Record<string, string[]> = JSON.parse(
					errors[0].message.replaceAll("'", '')
				);
				setAriaInvalid(Object.keys(errorMessages));

				afterSubmitState = {
					message: formData?.form?.settings?.errorMessageHtml,
					isSuccess: false
				};
				onerror?.(afterSubmitState.message);
			}
			isLoading = false;
		}
	);

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
			id={formData.data.form.handle}
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
										<Field {field} {updateFormFields} />
									</div>
								{/if}
							{/each}
						{/each}
					{/if}
				</div>
			{/each}
			{#if !afterSubmitState?.isSuccess}
				{@render submitButton()}
			{/if}

			{#if afterSubmitSnippet}
				{@render afterSubmitSnippet()}
			{/if}

			{#if recaptchaKey}
				{@render recaptchaHint?.()}
			{/if}
		</form>
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
