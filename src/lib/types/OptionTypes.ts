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
	recaptchaKey?: string; // done
	afterSubmit?: AfterSubmitOption; // done
	fields?: {
		fileUpload?: FileUploadOption; // done
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
	hideForm?: boolean;
	hideSubmitButton?: boolean;
	hidePagination?: boolean;
};

type FileUploadOption = {
	showNative?:
		| {
				textBeforeSelection: string;
				textAfterSelection: string; // define a count placeholder for the number of selected files with %%. e.g. %% files selected
				fileList?:
					| {
							cancel: Component | string; // text or icon  to display if list is defined
							buttonClass?: string;
							// transition?: // optional flip transition animation
					  }
					| false;
		  }
		| true; // if not defined or true, the native browser element will be rendered
	icon?: Component;
	fileList?: boolean; // if a list of selected files should be shown
};

export type DropdownOption = {
	showNative?:
		| {
				buttonIcon?: Component;
				selectedIcon?: Component;
		  }
		| true; // if not defined or true, the native browser element will be rendered
};
