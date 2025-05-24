/* =======================
 * Fetching Types
 * =======================
 */

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

type CraftGraphQlErrorProps = {
	extensions: {
		category: string;
	};
	locations: {
		line: number;
		column: 3;
	}[];
	message: string;
};

/* =======================
 * Formie Field Types
 * =======================
 */
export type FieldProps =
	| AddressFieldProps
	| AgreeFieldProps
	| CheckboxesFieldProps
	| DropdownFieldProps
	| EmailFieldProps
	| HeadingFieldProps
	| MultiLineTextFieldProps
	| NameFieldProps
	| NumberFieldProps
	| PhoneFieldProps
	| RadioFieldProps
	| SingleLineFieldProps
	| DateFieldProps
	| HiddenFieldProps;

export type BaseFormFieldProps<T extends string> = {
	conditions: string;
	containerAttributes: string | null;
	cssClasses: string | null;
	displayName: T;
	defaultValue: string | null;
	enableConditions: boolean;
	enableContentEncryption: boolean;
	errorMessage: string | null;
	handle: string;
	id: string;
	inputAttributes: string | null;
	inputTypeName: string;
	instructions: string | null;
	instructionsPosition: string | null;
	label: string;
	labelPosition: string | null;
	name: string;
	placeholder: string | null;
	required: boolean;
	type: string;
	typeName: string;
	visibility: string | null;
};

export type HiddenFieldProps = BaseFormFieldProps<'HiddenField'> & {
	defaultValue: string | null;
	defaultOption: string | null;
	queryParameter: string | null;
	cookieName: string | null;
};

export type DateFieldProps = BaseFormFieldProps<'Date'> & {
	ampmLabel: string;
	ampmPlaceholder: string;
	conditions: string;
	containerAttributes: string;
	cssClasses: string;
	dateFormat: string;
	dayLabel: string;
	dayPlaceholder: string;
	defaultDate: string;
	defaultOption: string;
	displayName: string;
	displayType: string;
	enableConditions: false;
	enableContentEncryption: false;
	errorMessage: string;
	handle: string;
	hourLabel: string;
	hourPlaceholder: string;
	id: string;
	inputAttributes: string;
	inputTypeName: string;
	instructions: string;
	instructionsPosition: string;
	label: string;
	labelPosition: string;
	maxDate: string;
	minDate: string;
	minuteLabel: string;
	minutePlaceholder: string;
	monthLabel: string;
	monthPlaceholder: string;
	name: string;
	placeholder: string;
	required: boolean;
	secondLabel: string;
	secondPlaceholder: string;
	timeFormat: string;
	timeLabel: string;
	type: string;
	typeName: string;
	useDatePicker: true;
	visibility: string;
	yearLabel: string;
	yearPlaceholder: string;
};

export type AddressFieldProps = BaseFormFieldProps<'Address'> & {
	fields: {
		id: string;
		label: string;
		placeholder: string;
		instructions: string;
		displayName: string;
		emailValue: string;
		typeName: string;
		type: string;
		inputTypeName: string;
		required: boolean;
		handle: string;
		conditions: string;
		cssClasses: string;
		defaultValue: string;
		enableConditions: boolean;
		enableContentEncryption: boolean;
		enabled: boolean;
		errorMessage: string;
		includeInEmail: boolean;
		instructionsPosition: string;
		labelPosition: string;
		matchField: string;
		prePopulate: string;
		subFieldLabelPosition: string;
		uid: string;
		visibility: string;
		options: {
			label: string;
			value: string;
			isDefault: boolean;
		}[];
	}[];
};

export type AgreeFieldProps = BaseFormFieldProps<'Agree'> & {
	checkedValue: string;
	defaultState: boolean;
	descriptionHtml: string;
	uncheckedValue: string;
};

export type CheckboxesFieldProps = BaseFormFieldProps<'Checkboxes'> & {
	layout: string;
	name: string;
	options: {
		checked: boolean;
		label: string;
		value: string;
		isDefault: boolean;
		disabled: boolean;
	}[];
	toggleCheckbox: string;
	toggleCheckboxLabel: string;
};

export type DropdownFieldProps = BaseFormFieldProps<'Dropdown'> & {
	options: {
		label: string;
		value: string;
		isDefault: boolean;
	}[];
};

export type EmailFieldProps = BaseFormFieldProps<'Email'>;

export type HeadingFieldProps = BaseFormFieldProps<'Heading'> & {
	headingSize: string;
};

export type SingleLineFieldProps = BaseFormFieldProps<'SingleLineText'>;

export type MultiLineTextFieldProps = BaseFormFieldProps<'MultiLineText'>;

export type NumberFieldProps = BaseFormFieldProps<'Number'> & {
	max: number;
	min: number;
};

export type NameFieldProps = BaseFormFieldProps<'Name'> & {
	fields: Array<{
		handle: string;
		label: string;
		placeholder: string;
		required: boolean;
	}>;
	firstNameCollapsed: boolean;
	firstNameDefaultValue: string;
	firstNameEnabled: boolean;
	firstNameErrorMessage: string;
	firstNameLabel: string;
	firstNamePlaceholder: string;
	firstNamePrePopulate: string;
	firstNameRequired: boolean;
	lastNameCollapsed: boolean;
	lastNameDefaultValue: string;
	lastNameEnabled: boolean;
	lastNameErrorMessage: string;
	lastNameLabel: string;
	lastNamePlaceholder: string;
	lastNamePrePopulate: string;
	lastNameRequired: boolean;
	middleNameCollapsed: boolean;
	middleNameDefaultValue: string;
	middleNameEnabled: boolean;
	middleNameErrorMessage: string;
	middleNameLabel: string;
	middleNamePlaceholder: string;
	middleNamePrePopulate: string;
	middleNameRequired: boolean;
	prefixCollapsed: boolean;
	prefixDefaultValue: string;
	prefixEnabled: boolean;
	prefixErrorMessage: string;
	prefixLabel: string;
	prefixOptions: {
		label: string;
		value: string;
	}[];
	prefixPlaceholder: string;
	prefixPrePopulate: string;
	prefixRequired: boolean;
	useMultipleFields: boolean;
};

export type PhoneFieldProps = BaseFormFieldProps<'Phone'> & {
	countryDefaultValue: string;
	countryEnabled: boolean;
	countryAllowed: string;
	countryOptions: {
		label: string;
		value: string;
	}[];
	countryShowDialCode: boolean;
};

export type HtmlProps = BaseFormFieldProps<'Html'> & {
	htmlContent: string;
};

export type RadioFieldProps = BaseFormFieldProps<'Radio'> & {
	layout: string;
	options: {
		label: string;
		value: string;
		isDefault: boolean;
		disabled: boolean;
	}[];
};

export type FileUploadProps = BaseFormFieldProps<'FileUpload'> & {
	sizeLimit: string | null;
	sizeMinLimit: string | null;
	limitFiles: string | null;
	allowedKinds: string[];
};
