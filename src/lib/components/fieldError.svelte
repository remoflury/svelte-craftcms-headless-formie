<script lang="ts">
	type Props = {
		error: string | undefined;
	};
	let { error }: Props = $props();
</script>

{#if error}
	<div data-formie-field-error>{error}</div>
{/if}
