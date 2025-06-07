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
npm install svelte-craftcms-headless-formie
```

Enable Views for the formie forms and creation of submission in the graphql schema.

## Usage

In your svelte file, import the component. And add the form handle and the public CMS API url. The Form handle can be passed in dynamically, as the form will be fetched client side.

```svelte
<script lang="ts">
	import { PUBLIC_CMS_API } from '$env/static/public';
	import FormieForm from 'svelte-craftcms-headless-formie';
</script>

<FormieForm handle="your-form-handle" publicCmsApi={PUBLIC_CMS_API} />
```

### Snippets

You can pass in multiple snippets:

- submitButton (required): Pass in a custom submit button (type submit)
- skeletonSnippet (optional): Will be rendered during the initial client side fetch. It is meant as a placeholder for skeleton loaders.
- errorSnippet (optional): will be rendered if the initial load of the form will throw an error.
- afterSubmitSnippet (optional): allows to render a custom submission message after a submission, disregarding wether it is an error or success.
- pagination (optional): rendering component used to display ui relevant for multistep form

### Props

| Prop                 | Description                                                                                                                                                                   | type                                                                 | default                     |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- | --------------------------- |
| `handle`             | the form handle                                                                                                                                                               | `string` (required)                                                  | -                           |
| `submitButton`       | your custom submitButton (type="submit")                                                                                                                                      | `Snippet` (required)                                                 |  -                          |
| `publicCmsApiKey`    | the cms api url, where the submission has to be sent to                                                                                                                       | `string` (required)                                                  | -                           |
| `siteId`             | siteId, which the submission should be submitted to.                                                                                                                          | `string \| number \| undefined`                                      | `undefined`                 |
| `recaptchaKey`       | if recaptcha is setup in formie, pass in the recaptcha key                                                                                                                    | `string \| undefined`                                                | undefined                   |
| `isLoading`          | allows you to bind to a loading state during the submission                                                                                                                   | `boolean \| undefined`                                               | false                       |
| `skeletonSnippet`    | renders a skeleton loader snippet                                                                                                                                             | `Snippet \| undefined`                                               | undefined                   |
| `afterSubmitSnippet` | renders a snippet after the submission. The message displayed will contain the elements from craft formie.                                                                    | `Snippet \| undefined `                                              | undefined                   |
| `errorSnippet`       | renders an error snippet if an error is caught during inititial render. In contrary to `afterSubmitSnippet`, this Snippet will allow you to render totally custom components. | `Snippet \| undefined`                                               | undefined                   |
| `pagination`         | Snippet used to display UI relevant with multistep forms                                                                                                                      | `Snippet`                                                            | undefined                   |
| `recaptchaHint`      | renders a snippet as a hint for recaptcha. Will only be shown, if a recaptchaKey is provieded                                                                                 | `Snippet \| undefined `                                              | recaptchaHintSnippet.svelte |
| `onaftersubmit`      | callback fired after submit. The event passed contains a message (defined in formie) aswell as the error state                                                                | `(message: string \| null, isSuccess: boolean) => void \| undefined` | undefined                   |

## Multistep forms

If you have a multistep form, use the multistep snippet, to display further information:

```svelte
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
```

Be aware, that a `type="button"` for pagination buttons is necessary. Otherwise, the form will be submitted before reaching the end.

## Styling

In your main css file just apply all the styles to the input fields.

`<FormieForm/>` Component does have a structure like this:

```html
<form data-formie-form>
	<div data-form-page="1">
		<!-- the number resemblences the current form page -->
		<div data-formie-field>
			<!-- wrapper for each input -->
			<div data-formie-field-single-line-text>
				<!-- data-attribute for top html element of given input type -->
				...
			</div>
		</div>
	</div>
</form>
```

The `data-formie-field-*` attribute stands for the top html element of a given input type. Those are the available data-attributes:

- `data-formie-field-address`
- `data-formie-field-agree`
- `data-formie-field-checkboxes`
- `data-formie-field-date`
- `data-formie-field-dropdown`
- `data-formie-field-email`
- `data-formie-field-heading`
- `data-formie-field-multi-line-text`
- `data-formie-field-name`
- `data-formie-field-number`
- `data-formie-field-phone`
- `data-formie-field-radio`
- `data-formie-field-single-line-text`
- `data-formie-recaptcha-hint`
- `data-formie-field-error`

Those data-attributes can be used to selectively target the fields / elements.

```css
[data-formie-field-email] {
	border: solid 1px black;
}
```

### Error Styling

When a submission is not returned with errors from Craft CMS, the regarding input fields will be automatically set with an `aria-invalid="true"` flag. On resubmit, this will be set to false.
This can be used to style invalid form-fields:

```css
[data-invalid='true'],
[data-formie-field-error] {
	color: red;
}
```

## Example

```svelte
<script lang="ts">
	import { PUBLIC_CMS_API } from '$env/static/public';
	import { FormieForm } from '$lib/index.js';

	let { data } = $props();
	const form = $derived(data.data.form);
	let isLoading = $state(false);
	let submitButtonText = $state('');
	let afterSubmitState: AfterSubmitState | undefined = $state();
</script>

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

	{#snippet submitButton({ text })}
		<button>{text}</button>
	{/snippet}

	{#snippet afterSubmitSnippet({ state })}
		<p style="color: {state.isSuccess ? 'green' : 'red'}">
			{state.message}
		</p>
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
