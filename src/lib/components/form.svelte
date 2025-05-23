<script lang="ts">
	import { addRecaptcha, checkFieldConditions } from '$lib/utils/formUtils.js';
	import { load, type ReCaptchaInstance } from 'recaptcha-v3';
	import { onMount, type Snippet } from 'svelte';
	import { getFormMutation, getMutationVariables } from '$lib/utils/mutationUtils.js';
	import { FormQuery } from '$lib/queries/FormQuery.js';
	import Field from './field.svelte';
	// import Button from '../button/button.svelte';
	// import ErrorMsg from '../fetching/errorMsg.svelte';
	import SubmissionMessage from './submissionMessage.svelte';
	// import Skeleton from '../fetching/skeleton.svelte';

	type Props = {
		handle: string;
		submitButton: Snippet;
		isLoading?: boolean;
		onsuccessfulsubmit?: () => void;
		skeletonSnippet?: Snippet;
		errorSnippet?: Snippet;
		recaptchaKey?: string;
		publicCmsApi: string;
	};
	let {
		handle,
		onsuccessfulsubmit,
		errorSnippet,
		skeletonSnippet,
		isLoading = $bindable(false),
		submitButton,
		recaptchaKey,
		publicCmsApi
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

		return {
			form: json.data.form,
			error: json.error
		};
	});

	const onSubmit = $derived(async (e: SubmitEvent, formData: any, siteId: number = 1) => {
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
			onsuccessfulsubmit?.();
		} else {
			// // eslint-disable @typescript-esling/no-unused-vars
			// let message = $state('');
			// if (json.errors[0].message.includes('Email is not a valid email')) {
			//   // eslint-disable @typescript-esling/no-unused-vars
			//   message = 'Bitte gib eine gültige E-Mail-Adresse ein.';
			// } else {
			//   // eslint-disable @typescript-esling/no-unused-vars
			//   message = formData?.form?.settings?.submitErrorMessageHtml;
			// }
			errorMessage = json.errors[0].message;
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
		class="col-span-full md:col-span-6 lg:col-span-8"
		bind:this={form}
		id={formData.form.handle}
		onsubmit={async (e) => await onSubmit(e, formData)}
	>
		{#each formData.form.pages as page, i (page.id)}
			<div class="space-y-6" id={page.id} class:hidden={i !== pageIndex || successMessage}>
				{#if page.rows.length > 0}
					<!-- eslint-disable-next-line -->
					{#each page.rows as row (crypto.randomUUID())}
						<!-- eslint-disable-next-line -->
						{#each row.rowFields as field (crypto.randomUUID())}
							{#if checkFieldConditions(field.conditions, formFields)}
								<div
									class="field relative grow {row.rowFields.length > 1 && 'basis-[40%]'}"
									data-field-wrapper
								>
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
			<!-- <div class="mt-4 lg:mt-6 2xl:mt-8">
				<Button type="submit" disabled={isLoading} active={true} aria-busy={isLoading}
					>{formData.form.pages[0].settings.submitButtonLabel}</Button
				>
			</div> -->
		{/if}

		{#if successMessage}
			<SubmissionMessage text={successMessage} success={true} />
		{/if}
		{#if errorMessage}
			<SubmissionMessage text={errorMessage} success={false} />
		{/if}

		<small class="mt-4 block w-full text-xs">
			This site is protected by reCAPTCHA and the Google
			<a class="text-xs underline" href="https://policies.google.com/privacy">Privacy Policy</a>
			and
			<a class="text-xs underline" href="https://policies.google.com/terms">Terms of Service</a>
			apply.
		</small>
	</form>
{:catch}
	{#if errorSnippet}
		{@render errorSnippet()}
	{/if}
{/await}
