<script lang="ts">
	import type { AfterSubmitState } from '$lib/types/ComponentTypes.js';
	import { addRecaptcha, areInputFieldsValid, checkFieldConditions } from '$lib/utils/formUtils.js';
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
		const json = await response.json();

		if (json.data && !json.errors) {
			afterSubmitState = {
				message: formData?.form?.settings?.submitActionMessageHtml,
				isSuccess: true
			};
			onsuccessfulsubmit?.(afterSubmitState.message);
		} else {
			console.error(json.errors);
			afterSubmitState = { message: formData?.form?.settings?.errorMessageHtml, isSuccess: false };
			onerror?.(afterSubmitState.message);
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
