<script lang="ts">
	import { PUBLIC_CMS_API, PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY } from '$env/static/public';
	import { FormieForm } from '$lib/index.js';
	import type { AfterSubmitState } from '$lib/types/FormTypes.js';

	let { data } = $props();
	const form = $derived(data.data.form);

	let isLoading = $state(false);
	let submitButtonText = $state('');
	let afterSubmitState: AfterSubmitState | undefined = $state();
</script>

<section>
	<FormieForm
		handle={form[0].handle}
		publicCmsApi={PUBLIC_CMS_API}
		recaptchaKey={PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY}
		onsuccessfulsubmit={(message) => console.log(message)}
		onerror={(message) => console.log(message)}
		bind:isLoading
		bind:submitButtonText
		bind:afterSubmitState
	>
		{#snippet skeletonSnippet()}
			this is a skeleton fallback
		{/snippet}

		{#snippet submitButton()}
			<button>{submitButtonText}</button>
		{/snippet}

		{#snippet afterSubmitSnippet()}
			{#if afterSubmitState}
				<p style="color: {afterSubmitState.isSuccess ? 'green' : 'red'}">
					<!-- eslint-disable-next-line -->
					{@html afterSubmitState.message}
				</p>
			{/if}
		{/snippet}

		{#snippet errorSnippet()}
			<p>This is an error message</p>
		{/snippet}
	</FormieForm>
</section>

<style>
	section {
		margin-inline: 2rem;
	}
</style>
