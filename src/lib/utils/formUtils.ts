/**
 * Überprüft die Bedingungen für ein Formularfeld und gibt `true` oder `false` zurück,
 * je nachdem, ob die Bedingungen erfüllt sind.
 *
 * @param {string} conditionsStr - JSON-String der Bedingungen des Feldes
 * @param {Array} formFields - Array der aktuellen Feldwerte
 * @returns {boolean} - `true`, wenn die Bedingungen erfüllt sind, sonst `false`
 */
export const checkFieldConditions = (
	conditionsStr: string,
	formFields: { handle: string; value: string }[]
) => {
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

export const getInputText = (label: string, placeholder: string | null = '', required = false) => {
	const text = `${label || placeholder || ''}${required ? ' *' : ''}`;
	return text;
};
