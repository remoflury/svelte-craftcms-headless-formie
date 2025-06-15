import type { FieldProps } from '$lib/types/FieldTypes.js';
import { FIELD_GQL_MAP, FORM_FRAGMENT_VALUES } from '$lib/constants/query.js';
import { gql } from 'graphql-tag';
import { type DocumentNode } from 'graphql';

/**
 * @function getFieldFragments
 * @description
 * This function takes in all the supported fields of the form-option
 * and generates the according gql query (fragment for the input fields)
 * @param { FieldProps['displayName'][] | undefined} handles representing the supported fields, defined in the config
 * @returns DocumentNode
 */
export const getFieldFragments = (
	handles: FieldProps['displayName'][] | undefined
): DocumentNode => {
	if (!handles || !handles.length) {
		// if the handle is empty or undefined, this means all supported fields should be generated

		const allFragments = Object.values(FIELD_GQL_MAP).join(',');
		return gql`
    fragment FieldFragment on FieldInterface {
      ${allFragments}
      }
      `;
		// ${BASE_FIELD_VALUES}
	}

	// else insert all the values for the supported types of the options field
	const fieldFragments = handles
		.map((handle) => {
			if (!FIELD_GQL_MAP[handle]) return '';
			return FIELD_GQL_MAP[handle];
		})
		.join('');

	// ${BASE_FIELD_VALUES}
	return gql`
   fragment FieldFragment on FieldInterface {
      ${fieldFragments}
    }`;
};

/**
 * @function getFormFragment
 * @description generates the FormFragment
 *  * @param { FieldProps['displayName'][] | undefined} handles representing the supported fields, defined in the config
 * @returns DocumentNode
 */
export const getFormFragment = (handles: FieldProps['displayName'][] | undefined): DocumentNode => {
	const fieldFragment = getFieldFragments(handles);
	return gql`
		${fieldFragment}
		${FORM_FRAGMENT_VALUES}
	`;
};
