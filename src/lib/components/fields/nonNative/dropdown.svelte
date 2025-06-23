<script lang="ts">
	import type { DropdownFieldProps } from '$lib/types/FieldTypes.js';
	import type { DropdownOption } from '$lib/types/OptionTypes.js';
	import Label from '$lib/components/label.svelte';
	import FieldError from '$lib/components/fieldError.svelte';
	import { clickOutside } from '$lib/utils/actionUtils.js';
	import { onMount } from 'svelte';

	type Props = {
		field: DropdownFieldProps;
		error: string | undefined;
		nativeOptions: DropdownOption['showNative'];
		updateFormFields: (handle: string, newValue: string) => void;
	};

	let { field, error, nativeOptions, updateFormFields }: Props = $props();

	let open = $state(false);
	let btnEl: HTMLButtonElement | undefined = $state(undefined);
	let selectedOptions: DropdownFieldProps['options'] = $state([]);
	let parsedSelectedOptions = $derived(JSON.stringify(selectedOptions.map((o) => o.value)));

	/**
	 * ========================
	 * 				functions
	 * ========================
	 */

	const toggle = () => (open = !open);
	/**
	 * @function handleKeyPress
	 * @description
	 * opens the custom dropdown if the open keys are inlcuded on the click event
	 *
	 * @param {KeyboardEvent} e - Event of button press
	 * @returns void
	 */
	const handleKeyPress = (e: KeyboardEvent) => {
		e.preventDefault();
		if (typeof nativeOptions !== 'object' || !btnEl) return;
		const { key } = e;
		const openKeys = ['Enter', ' '];

		if (openKeys.includes(key)) {
			toggle();
		}
	};

	/**
	 * @function handleEsc
	 * @description
	 * closes the dropdown, if an escape key is pressed on the body and the dropdown is open
	 *
	 * @param {KeyboardEvent} e - Event of button press
	 * @returns void
	 */
	const handleEsc = (e: KeyboardEvent) => {
		if (typeof nativeOptions !== 'object' || !btnEl) return;
		const { key } = e;
		if (key == 'Escape') open = false;
	};

	/**
	 * @function setSelectedOption
	 * @description
	 * sets an option
	 *
	 * @param { string } value - value of the selected option
	 * @returns void
	 */
	const setSelectedOption = (option: DropdownFieldProps['options'][number] | undefined) => {
		if (option?.disabled || !option) return;
		if (field.multi) {
			const index = selectedOptions.findIndex((opt) => opt.value === option?.value);
			if (index < 0) {
				selectedOptions.push(option);
			} else {
				selectedOptions.splice(index, 1);
			}
		} else {
			selectedOptions = option ? [option] : [];
			toggle();
		}

		updateFormFields(field.handle, parsedSelectedOptions);
	};

	onMount(() => {
		// set preselected if one is available
		selectedOptions = [field.options.find((o) => o.isDefault === true) || field.options[0]];
	});

	/**
	 * TODO:
	 * - scroll list for too long lists (with prop max height?)
	 */
</script>

<svelte:window onkeydown={handleEsc} />
{#if typeof nativeOptions === 'object'}
	<div data-formie-field-dropdown class={field.cssClasses ?? ''}>
		<Label required={field.required} for={field.handle}>{field.label}</Label>

		<div use:clickOutside onclickoutside={() => (open = false)} data-formie-field-dropdown-wrapper>
			{#if selectedOptions.length}
				<input name={field.handle} hidden bind:value={parsedSelectedOptions} />
				<!-- <input name={field.handle} type="hidden" hidden value="['opt1','option 2']" /> -->
			{/if}

			<button
				role="combobox"
				name={field.handle}
				id={field.handle}
				aria-invalid={!!error}
				aria-errormessage={error}
				aria-controls="listbox-{field.handle}"
				aria-haspopup="listbox"
				tabindex="0"
				aria-expanded={open}
				type="button"
				onclick={toggle}
				onkeydown={handleKeyPress}
				bind:this={btnEl}
			>
				{#if !selectedOptions.length}
					{field.options[0].label}
				{:else}
					{selectedOptions[0].label}
				{/if}

				{#if nativeOptions.buttonIcon}
					{@const BtnIcon = nativeOptions.buttonIcon}
					<span>
						<BtnIcon />
					</span>
				{/if}
			</button>
			{#if open}
				<ul role="listbox" id="listbox-{field.handle}">
					{#each field.options as option (option.value)}
						{@const isSelected = selectedOptions.some((o) => o.value === option.value)}
						<li
							role="option"
							value={option.value}
							aria-selected={isSelected}
							onclick={() => setSelectedOption(option)}
							onkeydown={() => setSelectedOption(option)}
							aria-disabled={option.disabled}
						>
							{option.label}

							{#if nativeOptions.selectedIcon && isSelected}
								{@const SelectedIcon = nativeOptions.selectedIcon}
								<SelectedIcon />
							{/if}
						</li>
					{/each}
				</ul>
			{/if}
			<FieldError {error} />
		</div>
	</div>
{/if}

<style>
	[data-formie-field-dropdown-wrapper] {
		position: relative;
		background-color: aquamarine;
	}

	button[role='combobox'] {
		/* Reset button styles */
		appearance: none;
		-webkit-appearance: none;
		border-radius: 0;
		text-align: inherit;
		background: none;
		box-shadow: none;
		padding: 0;
		cursor: pointer;
		border: none;
		color: inherit;
		font: inherit;
	}

	ul[role='listbox'] {
		position: absolute;
		top: 100%;
		left: 0;
		list-style: none;
		color: inherit;
		padding: 0;
		margin: 0;
		font: inherit;
		background-color: inherit;
	}

	li {
		cursor: pointer;
	}
</style>
