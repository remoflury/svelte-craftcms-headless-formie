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
	| HiddenFieldProps
	| FileUploadProps;

type Attributes = {
	label: string;
	value: string;
};

export type BaseFormFieldProps<T extends string> = {
	containerAttributes: Attributes[];
	cssClasses: string | null;
	conditions: string | null;
	enableConditions: boolean;
	enableContentEncryption: boolean;
	defaultValue: string | null;
	displayName: T;
	errorMessage: string | null;
	handle: string;
	id: string;
	inputAttributes: Attributes[];
	instructionsPosition: string | null;
	inputTypeName: string;
	instructions: string | null;
	label: string;
	labelPosition: string | null;
	type: `verbb\\formie\\fields\\${T}`;
	required: boolean;
	typeName: `Field-${T}`;
	placeholder: string | null;
	visibility: string | null;
};

export type HiddenFieldProps = BaseFormFieldProps<'HiddenField'> & {
	defaultValue: string | null;
	defaultOption: string | null;
	queryParameter: string | null;
	cookieName: string | null;
};

export type DateFieldProps = BaseFormFieldProps<'Date'> & {
	availableDaysOfWeek: string[];
	maxDate: string | null;
	minDate: string | null;
	nestedRows: {
		rowFields: {
			enabled: boolean;
			handle: 'date' | 'time';
			id: string;
			label: string;
			required: boolean;
		}[];
	}[];
};

export type AddressFieldProps = BaseFormFieldProps<'Address'> & {
	fields: {
		conditions: string | null;
		cssClasses: string | null;
		defaultValue: string | null;
		displayName: string;
		emailValue: string | null;
		enabled: boolean;
		errorMessage: string | null;
		handle: string;
		id: string;
		includeInEmail: boolean;
		inputTypeName: string;
		instructions: string | null;
		instructionsPosition: string | null;
		label: string;
		labelPosition: string | null;
		matchField: string | null;
		options?: {
			isDefault: boolean;
			label: string;
			value: string;
		}[];
		placeholder: string | null;
		prePopulate: string | null;
		required: boolean;
		subFieldLabelPosition: string;
		type: string;
		typeName: string;
		uid: string;
		visibility: string | null;
	}[];
};

export type AgreeFieldProps = BaseFormFieldProps<'Agree'> & {
	checkedValue: string;
	defaultState: boolean;
	descriptionHtml: string;
	uncheckedValue: string;
};

export type CheckboxesFieldProps = BaseFormFieldProps<'Checkboxes'> & {
	options: {
		value: string;
		label: string;
		isDefault: boolean;
		disabled: boolean;
		isOptgroup: boolean;
	}[];
	multi: boolean;
};

export type DropdownFieldProps = BaseFormFieldProps<'Dropdown'> & {
	options: {
		label: string;
		value: string;
		isDefault: boolean;
	}[];
	multi: boolean;
};

export type EmailFieldProps = BaseFormFieldProps<'Email'>;

export type HeadingFieldProps = BaseFormFieldProps<'Heading'> & {
	headingSize: Extract<keyof HTMLElementTagNameMap, `h${1 | 2 | 3 | 4 | 5 | 6}`>;
};

export type SingleLineFieldProps = BaseFormFieldProps<'SingleLineText'> & {
	limit: boolean;
	min: number | null;
	max: number | null;
};

export type MultiLineTextFieldProps = BaseFormFieldProps<'MultiLineText'> & {
	limit: boolean;
	min: number | null;
	max: number | null;
};

export type NumberFieldProps = BaseFormFieldProps<'Number'> & {
	max: number;
	maxValue: number | null;
	min: number;
	minValue: number | null;
};

export type NameFieldProps = BaseFormFieldProps<'Name'> & {
	fields: {
		handle: string;
		label: string;
		placeholder: string;
		required: boolean;
	}[];
	useMultipleFields: boolean;
};

export type PhoneFieldProps = BaseFormFieldProps<'Phone'> & {
	countryDefaultValue: string;
	countryEnabled: boolean;
	countryAllowed: string; // unparsed JSON string
	countryOptions: Omit<CountryAllowed, 'code'>[];
};

export type CountryAllowed = { code: string; label: string; value: string };

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
