import type { FormieFetchDataProps } from '$lib/types/FormTypes.js';
import type { ReCaptchaInstance } from 'recaptcha-v3';

/**
 * Überprüft die Bedingungen für ein Formularfeld und gibt `true` oder `false` zurück,
 * je nachdem, ob die Bedingungen erfüllt sind.
 *
 * @param {string} conditionsStr - JSON-String der Bedingungen des Feldes
 * @param {Array} formFields - Array der aktuellen Feldwerte
 * @returns {boolean} - `true`, wenn die Bedingungen erfüllt sind, sonst `false`
 */
export const checkFieldConditions = (
	conditionsStr: string | null,
	formFields: { handle: string; value: string }[]
) => {
	console.log(conditionsStr);
	if (!conditionsStr) return true;
	if (!conditionsStr) return true;
	// Parse the conditions JSON
	const conditions = JSON.parse(conditionsStr);

	// Falls keine Bedingungen vorliegen, das Feld anzeigen
	if (!conditions || !conditions.conditions) return true;

	// Durchlaufen aller Bedingungen
	for (const condition of conditions.conditions) {
		// Finde das Triggerfeld anhand des Handles
		const triggerField = formFields.find(
			(field) => field.handle === condition.field.replace('{field:', '').replace('}', '')
		);

		// Wenn kein Triggerfeld gefunden wird, Bedingung als nicht erfüllt betrachten
		if (!triggerField) return false;

		// Vergleiche den Wert des Triggerfeldes mit dem in der Bedingung
		const fieldValue = triggerField.value;
		if (condition.condition === '=' && fieldValue !== condition.value) {
			return false;
		}
		if (condition.condition === '!=' && fieldValue === condition.value) {
			return false;
		}
		// Zusätzliche Vergleichsoperatoren (z.B. `<`, `>`) können hier ergänzt werden
	}

	// Wenn alle Bedingungen erfüllt sind, true zurückgeben
	return true;
};

/**
 * Inserts or updates an object in an array based on its `handle` property.
 *
 * Searches the provided array for an object whose `handle` matches the
 * `handle` of the given element. If found, replaces that object in-place;
 * otherwise, appends the element to the end of the array.
 *
 * @param {Object[]} array - The array of objects to upsert into.
 * @param {{ [key: string]: string }} element - The object to insert or update.
 *   Must have a `handle` property of type string.
 * @returns {void}
 *
 * @example
 * const items = [
 *   { handle: 'foo', value: 'old' },
 *   { handle: 'bar', value: 'baz' }
 * ];
 *
 * upsert(items, { handle: 'foo', value: 'new' });
 * // items is now [ { handle: 'foo', value: 'new' }, { handle: 'bar', value: 'baz' } ]
 *
 * upsert(items, { handle: 'qux', value: 'added' });
 * // items is now [
 * //   { handle: 'foo', value: 'new' },
 * //   { handle: 'bar', value: 'baz' },
 * //   { handle: 'qux', value: 'added' }
 * // ]
 */
/* eslint-disable  @typescript-eslint/no-explicit-any */
export const upsert = (array: any[], element: { [key: string]: string }) => {
	const i = array.findIndex((el) => {
		return el.handle === element.handle;
	});

	if (i > -1) {
		array[i] = element;
	} else {
		array.push(element);
	}
};

/**
 * @async addRecaptcha
 * @description
 * Adds recaptcha validation to the formData if a key is provided
 * @returns void
 */
export const addRecaptcha = async (
	recaptcha: ReCaptchaInstance | undefined,
	formData: FormieFetchDataProps,
	recaptchaKey: string | undefined
) => {
	if (!recaptchaKey || !recaptcha) return;
	const token = await recaptcha.execute('recaptchaCaptcha');
	upsert(formData.form.captchas, {
		handle: 'recaptchaCaptcha',
		name: 'g-recaptcha-response',
		value: token
	});
};

/**
 * @function areInputFieldsValid
 * @description checks the validity of all form fields of the current form page
 * @returns boolean
 */
export const areInputFieldsValid = (pages: { id: string }[], pageIndex: number): boolean => {
	const page = document.getElementById(pages[pageIndex].id) as HTMLFormElement;
	const formFields = [...page.querySelectorAll('input, select, textarea')] as (
		| HTMLInputElement
		| HTMLSelectElement
		| HTMLTextAreaElement
	)[];
	return checkValidity(formFields);
};

/**
 * @function checkValidity
 * @description
 * Checks the validity form a passed in from HTML ELements Array
 * @param elems
 * @returns boolean
 */
export const checkValidity = (
	elems: (HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement)[]
) => {
	let isValid = true;
	elems.forEach((field) => {
		if (!field.checkValidity()) {
			field.reportValidity();
			isValid = false;
		}
	});

	return isValid;
};
