# Svelte Forms for Craft CMS & Formie

This is a repo which is useful for [Craft CMS](https://craftcms.com/) in its headless configuration with using the [plugin formie](https://verbb.io/craft-plugins/formie/features).
It allows you to simply install the dependencies, style your components without further configuration.

## Requirements

- Craft CMS > 5.0
- Formie > 3.0
- Craft CMS's GraphQl Schema enabled

## Installation & Setup

In your frontend code run

```sh
npm install tbd
```

Enable Views for the formie forms and creation of submission in the graphql schema.

## Usage

In your svelte file, import the component. And add the form handle and the public CMS API url. The Form handle can be passed in dynamically, as the form will be fetched client side.

```svelte
<script lang="ts">
	import { PUBLIC_CMS_API } from '$env/static/public';
	import FormieForm from 'tbd';
</script>

<FormieForm handle="your-form-handle" publicCmsApi={PUBLIC_CMS_API} />
```

### snippets

You can pass in multiple snippets:

- submitButton (required): Pass in a custom submit button (type submit)
- skeletonSnippet (optional): Will be rendered during the initial client side fetch. It is meant as a placeholder for skeleton loaders.
- errorSnippet (optional): will be rendered if the initial load of the form will throw an error.
- afterSubmitSnippet (optional): allows to render a custom submission message after a submission, disregarding wether it is an error or success.

### Props

| Prop                 | Description                                                                                   | type                                             | default                     |
| -------------------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------ | --------------------------- |
| `handle`             | the form handle                                                                               | `string` (required)                              | -                           |
| `submitButton`       | your custom submitButton (type="submit")                                                      | `Snippet` (required)                             |  -                          |
| `publicCmsApiKey`    | the cms api url, where the submission has to be sent to                                       | `string` (required)                              | -                           |
| `recaptchaKey`       | if recaptcha is setup in formie, pass in the recaptcha key                                    | `string \| undefined`                            | undefined                   |
| `isLoading`          | allows you to bind to a loading state during the submission                                   | `boolean \| undefined`                           | false                       |
| `skeletonSnippet`    | renders a skeleton loader snippet                                                             | `Snippet \| undefined`                           | undefined                   |
| `errorSnippet`       | renders an error snippet if an error is caught during inititial render                        | `Snippet \| undefined`                           | undefined                   |
| `afterSubmitSnippet` | renders a snippet after the submission                                                        | `Snippet \| undefined `                          | undefined                   |
| `recaptchaHint`      | renders a snippet as a hint for recaptcha. Will only be shown, if a recaptchaKey is provieded | `Snippet \| undefined `                          | recaptchaHintSnippet.svelte |
| `onsuccessfulsubmit` | callback on a successful submit, gives back a message as string (defined in formie)           | `(message: string \| null) => void \| undefined` | undefined                   |
| `onerror`            | callback on an unsuccessful submit, gives back a message as string (defined in formie)        | `(message: string \| null) => void \| undefined` | undefined                   |

## Example Usage

```svelte
<script lang="ts">
	import { PUBLIC_CMS_API } from '$env/static/public';
	import { FormieForm } from '$lib/index.js';

	let { data } = $props();
	const form = $derived(data.data.form);
	let isLoading = $state(false);
</script>

<FormieForm
	handle={form[0].handle}
	publicCmsApi={PUBLIC_CMS_API}
	recaptchaKey={PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY}
	onsuccessfulsubmit={(message) => console.log(message)}
	onerror={(message) => console.log(message)}
	bind:isLoading
>
	{#snippet skeletonSnippet()}
		this is a skeleton fallback
	{/snippet}

	{#snippet submitButton()}
		<button>Submiiit</button>
	{/snippet}

	{#snippet afterSubmitSnippet()}
		<p>This will be shown after submission</p>
	{/snippet}

	{#snippet errorSnippet()}
		<p>This is an error message</p>
	{/snippet}
</FormieForm>
```

## Limitations

Currently, only the following formie Fields are supported:

- Address
- Agree
- Checkboxes
- Date / Time
- Dropdown
- Email Address
- Heading
- Multi-line Text
- Name
- Number
- Phone Number
- Radio Buttons
- Single-line Text
