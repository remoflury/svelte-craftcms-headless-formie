import { describe, expect, test } from 'vitest';
import { checkFieldConditions, checkValidity, upsert } from './formUtils.js';

const createInputEl = (
	tag: 'input' | 'textarea' | 'select',
	attribute?: { name: string; value: string }
) => {
	const el = document.createElement(tag);
	if (attribute) {
		el.setAttribute(attribute.name, attribute.value);
	}
	return el;
};

describe('formUtils', () => {
	// test('serial test', async () => { /* ... */ })
	test.concurrent('areInputFieldsValid', () => {
		// check if a normal input field is valid
		const inputEl = createInputEl('input');
		const textareaEl = createInputEl('textarea');
		const select = createInputEl('select');
		const isValid = checkValidity([inputEl, textareaEl, select]);

		expect(isValid).toEqual(true);
	});
	test.concurrent('areInputFieldsValid', () => {
		// check if an empty but required input field is marked as not valid
		const inputEl = createInputEl('input', { name: 'required', value: true.toString() });
		const textareaEl = createInputEl('textarea', { name: 'required', value: true.toString() });
		const select = createInputEl('select', { name: 'required', value: true.toString() });
		const isValid = checkValidity([inputEl, textareaEl, select]);

		expect(isValid).toEqual(false);
	});
	test.concurrent('upsert', () => {
		const mockData = [
			{
				handle: 'handle',
				value: 'value',
				name: 'name'
			},
			{ handle: 'handle2', value: 'value2', name: 'name2' }
		];
		const newValue = 'newValue';

		upsert(mockData, { handle: mockData[0].handle, value: newValue, name: mockData[0].name });

		expect(mockData[0].value).toEqual(newValue);
	});

	test.concurrent('checkFieldConditions', () => {
		const formFields = [
			{ handle: 'singleLineText', value: '' },
			{ handle: 'multiline', value: '' }
		];
		const mockConditions = '{"showRule":"show","conditionRule":"all","conditions":[]}';
		const isValid = checkFieldConditions(mockConditions, formFields);
		expect(isValid).toEqual(true);

		const mockConditions2 =
			'{"showRule":"show","conditionRule":"all","conditions":[{"id":"new6057-2230","field":"{field:multiline}","condition":"startsWith","value":"a"}]}';
		const isValid2 = checkFieldConditions(mockConditions2, formFields);

		expect(isValid2).toEqual(true);
	});
});
