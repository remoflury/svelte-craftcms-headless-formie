<script lang="ts">
	import { FormieForm } from '$lib/index.js';

	// let { data } = $props();

	let isLoading = $state(false);
</script>

<section>
	<FormieForm
		handle="fileupload"
		publicCmsApi="https://craft-test.ddev.site/api"
		onaftersubmit={(e) => console.log(e)}
		bind:isLoading
	>
		{#snippet pagination({ currentIndex, totalPages, backBtn, nextBtn })}
			<div>
				{currentIndex + 1} / {totalPages}
				{#if backBtn}
					<button type="button" onclick={backBtn.onclick}>{backBtn.text}</button>
				{/if}
				{#if nextBtn && currentIndex + 1 !== totalPages}
					<button type="button" onclick={nextBtn.onclick}>{nextBtn.text}</button>
				{/if}
			</div>
		{/snippet}
		{#snippet skeletonSnippet()}
			this is a skeleton fallback
		{/snippet}

		{#snippet submitButton({ text })}
			<button>{text}</button>
		{/snippet}

		{#snippet afterSubmitSnippet({ state })}
			<p style="color: {state.isSuccess ? 'green' : 'red'}">
				<!-- eslint-disable-next-line -->
				{@html state.message}
			</p>
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
