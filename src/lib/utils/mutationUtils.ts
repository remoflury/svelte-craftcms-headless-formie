import type { RecaptchaProps } from '$lib/types/FormTypes.js';
//
// Credit to Dave Stockley (magicspon)
// https://github.com/magicspon
//

import { gql } from 'graphql-tag';
// @ts-expect-error no ts support
import FormDataJson from 'form-data-json-convert';
import { flatMap, isPlainObject } from 'lodash-es';
import type { FormieFetchDataProps } from '$lib/types/FormTypes.js';
import type { FieldProps } from '$lib/types/FieldTypes.js';
// import { base64 } from '@sveu/browser';

export const getFormFieldMeta = (form: FormieFetchDataProps['form']) => {
	const allRows: { rowFields: FieldProps[] }[] = flatMap(form.pages, 'rows');
	const allFields: FieldProps[] = flatMap(allRows, 'rowFields');

	const fields = flatMap(
		allFields,
		({ handle, inputTypeName }: { handle: string; inputTypeName: string }) => {
			return { handle, inputTypeName };
		}
	);

	return fields;
};

function createMutationHandle(form: FormieFetchDataProps['form']) {
	return `save_${form.handle}_Submission`;
}

function createMutationTypes(form: FormieFetchDataProps['form']) {
	const types = getFormFieldMeta(form).map(
		({ handle, inputTypeName }: { handle: string; inputTypeName: string }) => {
			return `$${handle}: ${inputTypeName}`;
		}
	);

	// Add in any captcha tokens generated when we queried the form.
	form.captchas.forEach((captcha: FormieFetchDataProps['form']['captchas'][number]) => {
		types.push(`$${captcha.handle}: FormieCaptchaInput`);
	});

	return types.join(', ');
}

function createMutationValues(form: FormieFetchDataProps['form'], siteId?: number | string) {
	const values = flatMap(getFormFieldMeta(form), 'handle').map((key: string) => {
		return `${key}: $${key}`;
	});

	// Add in any captcha tokens generated when we queried the form.
	form.captchas.forEach((captcha: RecaptchaProps) => {
		values.push(`${captcha.handle}: $${captcha.handle}`);
	});

	// for multi site / multilanguage sites
	if (siteId) {
		values.push(`siteId: ${siteId}`);
	}

	return values.join(', ');
}

export const getFormMutation = (form: FormieFetchDataProps['form'], siteId?: number | string) => {
	const mutationTypes = createMutationTypes(form);
	const mutationHandle = createMutationHandle(form);
	const mutationValues = createMutationValues(form, siteId);

	return gql`
        mutation FormMutation(${mutationTypes}) {
            submission: ${mutationHandle}(${mutationValues}) {
                id
            }
        }
    `;
};

export const getMutationVariables = async (
	form: FormieFetchDataProps['form'],
	el: HTMLFormElement | undefined
) => {
	const formData = new FormData(el);
	const object = FormDataJson.toJson(el);
	const mutationTypes = getFormFieldMeta(form);
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	function groupFields(object: any, fieldName: string) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const groupedFields: any = {};
		Object.keys(object).forEach((key) => {
			if (key.startsWith(`${fieldName}-`)) {
				const subField = key.replace(`${fieldName}-`, '');
				groupedFields[subField] = object[key];
				delete object[key];
			}
		});
		return groupedFields;
	}

	const getBase64 = (file: File) => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result);
			reader.onerror = (error) => reject(error);
		});
	};

	for (const info of mutationTypes) {
		// console.log('info', info)
		const { handle, inputTypeName } = info;
		let value = object[handle];

		// Check for grouped fields and process them
		if (inputTypeName.includes('FormieGroupInput')) {
			object[handle] = groupFields(object, handle);
		}

		// Fix FileUploadInput
		if (inputTypeName === '[FileUploadInput]') {
			const fileInputValue = formData.get(info.handle) as File | null;
			if (fileInputValue?.size) {
				try {
					// const base64Value = base64(fileInputValue)
					const base64Value = await getBase64(fileInputValue); // Wait for the base64 conversion
					object[info.handle] = [{ fileData: base64Value, filename: fileInputValue.name }]; // Assign the base64 string to the object

					console.log('object', object);
					console.log('info.handle', info.handle);
				} catch (error) {
					console.error('Error converting file to base64:', error);
				}
			} else {
				// Provide a default value for file inputs when no file is uploaded
				object[info.handle] = []; // or set to null or any other placeholder that your backend expects
			}
		}

		// Neue Logik in getMutationVariables
		if (inputTypeName.includes('FormieRepeaterInput')) {
			object[info.handle] = { rows: [] };
			const rowKeys = Object.keys(object).filter((key) => key.startsWith(`${info.handle}-rows`));

			const groupedRows = rowKeys.reduce((acc, key) => {
				const rowMatch = key.match(/-(\d+)-(.+)$/);
				if (rowMatch) {
					const [_, rowIndex, fieldName] = rowMatch;
					console.log(_);
					// @ts-expect-error works fine
					if (!acc[rowIndex]) acc[rowIndex] = {};
					// @ts-expect-error works fine
					acc[rowIndex][fieldName] = object[key];
					delete object[key];
				}
				return acc;
			}, []);

			object[info.handle].rows = groupedRows;
		}

		// Fix Name subfields
		else if (
			inputTypeName.endsWith('FormieNameInput') ||
			inputTypeName.endsWith('FormieAddressInput')
		) {
			object[info.handle] = {};
			const keys = Object.keys(object).filter((key) => key.startsWith(info.handle + '-'));
			keys.forEach((key) => {
				object[info.handle][key.replace(info.handle + '-', '')] = object[key];
				delete object[key];
			});
		} else if (typeof value === 'undefined') {
			continue;
		}

		// Fix up any objects that look like arrays
		else if (isPlainObject(value)) {
			if (typeof value[0] !== 'undefined') {
				value = Object.values(value);
				object[info.handle] = value;
			}
		} else if (info.inputTypeName === 'Int') {
			value = parseInt(object[info.handle], 10);
			object[info.handle] = value;
		} else if (info.inputTypeName === '[Int]') {
			if (isPlainObject(value)) {
				value = Object.values(value);
			}

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			value = value.map((item: any) => {
				return parseInt(item, 10);
			});
			object[info.handle] = value;
		} else if (info.inputTypeName === 'Number') {
			value = Number(object[info.handle]);
			object[info.handle] = value;
		} else if (info.inputTypeName === '[Number]') {
			if (isPlainObject(value)) {
				value = Object.values(value);
			}
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			value = value.map((item: any) => {
				return Number(item);
			});
			object[info.handle] = value;
		} else {
			object[info.handle] = value;
		}
	}

	// Add in any captcha tokens generated when we queried the form.
	form.captchas.forEach((captcha: RecaptchaProps) => {
		object[captcha.handle] = {
			name: captcha.name,
			value: captcha.value
		};
	});

	console.log('ooobj', object);
	return object;
};

export const allowedFileTypes: Record<string, { result: string; key: string }> = {
	all: {
		result: '*',
		key: ''
	},
	word: {
		result: '.doc, .docx',
		key: 'word'
	},
	image: {
		result: 'image/*',
		key: 'image'
	},
	pdf: {
		result: '.pdf',
		key: 'pdf'
	},
	audio: {
		result: 'audio/*',
		key: 'audio'
	},
	captionsSubtitles: {
		result: '.vtt, .srt',
		key: 'captionsSubtitles'
	},
	json: {
		result: 'application/json',
		key: 'json'
	},
	excel: {
		result: '.xls, .xlsx',
		key: 'excel'
	},
	compressed: {
		result: '.zip, .rar, .7zip',
		key: 'compressed'
	},
	javascript: {
		result: '.js',
		key: 'javascript'
	},
	text: {
		result: '.txt, .rtf',
		key: 'text'
	},
	powerpoint: {
		result: '.ppt, .pptx, .pps, .ppsx',
		key: 'powerpoint'
	},
	video: {
		result: 'video/*',
		key: 'video'
	}
};

export const getAllowedFileTypes = (input: string[]): string => {
	if (input.length === 0) return '*';
	const fileTypes = input.map((type) => {
		let result: string = '';
		switch (type) {
			case allowedFileTypes.word.key:
				result = allowedFileTypes.word.result;
				break;
			case allowedFileTypes.image.key:
				result = allowedFileTypes.image.result;
				break;
			case allowedFileTypes.pdf.key:
				result = allowedFileTypes.pdf.result;
				break;
			case allowedFileTypes.audio.key:
				result = allowedFileTypes.audio.result;
				break;
			case allowedFileTypes.captionsSubtitles.key:
				result = allowedFileTypes.captionsSubtitles.result;
				break;
			case allowedFileTypes.json.key:
				result = allowedFileTypes.json.result;
				break;
			case allowedFileTypes.excel.key:
				result = allowedFileTypes.excel.result;
				break;
			case allowedFileTypes.compressed.key:
				result = allowedFileTypes.compressed.result;
				break;
			case allowedFileTypes.javascript.key:
				result = allowedFileTypes.javascript.result;
				break;
			case allowedFileTypes.text.key:
				result = allowedFileTypes.text.result;
				break;
			case allowedFileTypes.powerpoint.key:
				result = allowedFileTypes.powerpoint.result;
				break;
			case allowedFileTypes.video.key:
				result = allowedFileTypes.video.result;
				break;
		}

		return result;
	});

	return fileTypes.join(', ');
};
