<script lang="ts">
	import type { AfterSubmitState } from '$lib/types/FormTypes.js';
	import { addRecaptcha, checkFieldConditions } from '$lib/utils/formUtils.js';
	import { load, type ReCaptchaInstance } from 'recaptcha-v3';
	import { onMount, type Snippet } from 'svelte';
	import { getFormMutation, getMutationVariables } from '$lib/utils/mutationUtils.js';
	import { FormQuery } from '$lib/queries/FormQuery.js';
	import { recaptchaHintSnippet } from './recaptchaHintSnippet.svelte';
	import Field from './field.svelte';

	type Props = {
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
		afterSubmitState = $bindable(undefined)
	}: Props = $props();

	const variables = $derived({
		handle
	});

	let formFields: { handle: string; value: string }[] = $state([]);
	let pageIndex = $state(0);
	let pages: { id: string }[] = $state([]);
	let successMessage: string | null = $state(null);
	let isSuccessful = $state(false);
	let errorMessage: string | null = $state(null);
	let form: HTMLFormElement | undefined = $state();
	let recaptcha: ReCaptchaInstance | undefined = $state();

	const query = FormQuery?.loc?.source?.body;

	let options = $derived({
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ query, variables })
	});

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
		const json = await response.json();

		// pagesCount = json.data.form.pages.length;
		pages = json.data.form.pages;

		/* eslint-disable  @typescript-eslint/no-explicit-any */
		formFields = json.data.form.pages.flatMap((page: any) =>
			/* eslint-disable  @typescript-eslint/no-explicit-any */
			page.rows.flatMap((row: any) =>
				/* eslint-disable  @typescript-eslint/no-explicit-any */
				row.rowFields.flatMap((field: any) => [{ handle: field.handle, value: '' }])
			)
		);

		// submitButtonText = json.data.form
		submitButtonText = json.data.form.pages[0].settings.submitButtonLabel;
		return {
			form: json.data.form,
			error: json.error
		};
	});

	const onSubmit = $derived(async (e: SubmitEvent, formData: any, siteId: number = 1) => {
		afterSubmitState = undefined;
		e.preventDefault();
		isLoading = true;
		// return early if recaptcha instance is not present and there is a recaptcha key
		if (!recaptcha && recaptchaKey) return;
		const page = document.getElementById(pages[pageIndex].id) as HTMLFormElement;
		const formFields = page.querySelectorAll('input, select, textarea');
		let isValid = true;
		formFields.forEach((field) => {
			if (!(field as HTMLInputElement).checkValidity()) {
				(field as HTMLInputElement).reportValidity();
				isValid = false;
			}
		});
		if (!isValid) {
			return;
		}
		isLoading = true;

		successMessage = null;
		errorMessage = null;

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
		const json = await response.json();

		if (json.data && !json.errors) {
			isSuccessful = true;
			successMessage = formData?.form?.settings?.submitActionMessageHtml;
			afterSubmitState = { message: successMessage, isSuccess: true };
			onsuccessfulsubmit?.(successMessage);
		} else {
			errorMessage = json.errors[0].message;
			afterSubmitState = { message: errorMessage, isSuccess: false };
			onerror?.(errorMessage);
		}
		isLoading = false;
	});

	onMount(async () => {
		if (!recaptchaKey) return;
		recaptcha = await load(recaptchaKey, { autoHideBadge: true });
	});
</script>

{#await fetchData()}
	{#if skeletonSnippet}
		{@render skeletonSnippet()}
	{/if}
{:then formData}
	<form
		bind:this={form}
		id={formData.form.handle}
		onsubmit={async (e) => await onSubmit(e, formData)}
		data-formie-form
	>
		{#each formData.form.pages as page, i (page.id)}
			<div id={page.id} class:hidden={i !== pageIndex || successMessage} data-formie-page={page.id}>
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
		{#if !isSuccessful}
			{@render submitButton()}
		{/if}

		{#if afterSubmitSnippet}
			{@render afterSubmitSnippet()}
		{/if}

		{#if recaptchaKey}
			{@render recaptchaHint?.()}
		{/if}
	</form>
{:catch}
	{#if errorSnippet}
		{@render errorSnippet()}
	{/if}
{/await}
