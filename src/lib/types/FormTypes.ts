/* =======================
 * Fetching Types
 * =======================
 */

import type { FieldProps } from './FieldTypes.js';

export type FormField = { handle: string; value: string }; // used to update the values of the field

export type FormieFetchProps = {
	data: FormieFetchDataProps | undefined;
	errors: CraftGraphQlErrorProps[] | undefined;
};

export type FormieFetchDataProps = {
	form: {
		id: string;
		captchas: RecaptchaProps[];
		csrfToken: {
			name: string;
			value: string;
		};
		handle: string;
		siteId: number;
		title: string;
		settings: FormieSettingsProps;
		pages: FormiePagesProps[];
	};
};

export type FormiePagesProps = {
	id: string;
	label: string;
	settings: FormiePagesSettingsProps;
	rows: {
		rowFields: FieldProps[];
	}[];
};

type FormiePagesSettingsProps = {
	submitButtonLabel: string;
	pageConditions: string;
	backButtonLabel: string;
	showBackButton: boolean;
	buttonsPosition: string;
	enablePageConditions: boolean;
};

type RecaptchaProps = {
	handle: string;
	value: string;
	name: string;
};

type FormieSettingsProps = {
	defaultInstructionsPosition: string;
	defaultLabelPosition: string;
	displayCurrentPageTitle: boolean;
	displayFormTitle: boolean;
	displayPageProgress: boolean;
	displayPageTabs: boolean;
	errorMessageHtml: string | null;
	integrations: {
		settings: string;
	}[];
	loadingIndicator: string | null;
	loadingIndicatorText: string | null;
	progressPosition: string;
	redirectEntry: string | null;
	redirectUrl: string | null;
	submitAction: string;
	submitActionFormHide: boolean;
	submitActionMessageHtml: string | null;
	submitActionMessageTimeout: number;
	submitActionTab: string | null;
	submitMethod: string;
	validationOnFocus: boolean;
	validationOnSubmit: boolean;
};

export type CraftGraphQlErrorProps = {
	extensions: {
		category: string;
	};
	locations: {
		line: number;
		column: 3;
	}[];
	message: string;
};

export type FormieErrorReturnObj = Record<string, string[]>;
