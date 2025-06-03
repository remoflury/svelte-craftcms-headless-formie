<!-- <script lang="ts">
	import { PUBLIC_CMS_API } from '$env/static/public';
	import { FormieForm, type AfterSubmitState } from '$lib/index.js';

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
		onsuccessfulsubmit={() => console.log('success')}
		onerror={() => console.log('error')}
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
					{ afterSubmitState.message}
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
</style> -->
