<script lang="ts">
	import { cubicIn } from 'svelte/easing';
	import { slide } from 'svelte/transition';

	type Props = {
		text: string;
		success: boolean;
	};
	let { text, success }: Props = $props();
</script>

<p
	transition:slide={{ duration: 250, easing: cubicIn }}
	class="mt-8 px-4 py-3 lg:py-6"
	class:bg-red-300={!success}
	class:text-white={!success}
	class:border={success}
	class:border-red-300={success}
	class:text-black={success}
>
	<!-- eslint-disable-next-line -->
	{@html text}
</p>
