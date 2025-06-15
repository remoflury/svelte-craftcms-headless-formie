import type { Component } from 'svelte';
// import type { FieldProps } from './FieldTypes.js';
import type {
	BlurParams,
	FadeParams,
	FlyParams,
	ScaleParams,
	SlideParams
} from 'svelte/transition';

export type Options = {
	// supportedFields?: FieldDisplayNameOption[];
	recaptchaKey?: string;
	afterSubmit?: AfterSubmitOption;
	fields?: {
		fileUpload?: FileUploadOption;
		dropdown?: DropdownOption;
	};
	transition?: TransitionOption;
	// TODOI: Placement
};

// type FieldDisplayNameOption = FieldProps['displayName'];

type TransitionTypes = 'fade' | 'fly' | 'blur' | 'scale' | 'slide';
type TransitionOption = {
	type?: TransitionTypes; // TODO: differantiate between in: / out:
	options?: FadeParams | FlyParams | BlurParams | ScaleParams | SlideParams;
};

type AfterSubmitOption = {
	showForm?: boolean;
	showSubmitButton?: boolean;
};

type FileUploadOption = {
	browerNative?: boolean;
	icon?: Component;
	fileList?: boolean; // if a list of selected files should be shown
};

type DropdownOption = {
	browerNative?: boolean;
};
