<script lang="ts">
	import { PUBLIC_CMS_API } from '$env/static/public';
	import { FormieForm } from '$lib/index.js';

	let { data } = $props();
	const form = $derived(data.data.form);
	$inspect(form);
</script>

<h1>Welcome to your library project</h1>
<h2>{data.data.title}</h2>
<p>Create your package using @sveltejs/package and preview/showcase your work with SvelteKit</p>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

<section>
	<FormieForm handle={form[0].handle} publicCmsApi={PUBLIC_CMS_API}>
		{#snippet skeletonSnippet()}
			this is a skeleton fallback
		{/snippet}

		{#snippet submitButton()}
			<button>Submiiit</button>
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
