<script lang="ts">
	let { data } = $props();
	const form = $derived(data.data.form);
	$inspect(form);
</script>

<h1>Welcome to your library project</h1>
<h2>{data.data.title}</h2>
<p>Create your package using @sveltejs/package and preview/showcase your work with SvelteKit</p>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>
