import type { FormieErrorReturnObj } from './types/FormTypes.js';

/**
 * @class FormStore
 * @description
 * custom error class, which can be used to map the errors to its field
 *
 * @example
 * ```svelte
 * <script>
 *  const error = $derived(formStore.errorByHandle(field?.handle));
 * </script>
 * <input
 *  type="text"
 *  aria-invalid={!!error}
 *  aria-errormessage={error}
 * />
 * <FieldError {error} /> <!-- will only be shown if errors are present -->
 */
export class FormStore {
	#errors: FormieErrorReturnObj | undefined = $state(undefined);

	/**
	 * ERROR
	 */
	clearErrors() {
		this.#errors = undefined;
	}
	// set errorobject
	set errors(value: FormieErrorReturnObj) {
		this.#errors = value;
	}
	// get errorobject
	get errors(): FormieErrorReturnObj | undefined {
		return this.#errors;
	}

	errorByHandle(handle: string | null | undefined) {
		// console.log({handle})
		if (!handle) return undefined;
		const obj = this.#errors;
		// console.log({obj})
		if (!obj || !obj[handle] || obj[handle].length === 0) return undefined;
		return obj[handle][0];
	}
}
