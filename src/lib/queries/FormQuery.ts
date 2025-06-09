import { gql } from 'graphql-tag';

export const FieldFragment = gql`
	fragment FieldFragment on FieldInterface {
		id
		label
		handle
		instructions
		required
		type
		displayName
		typeName
		inputTypeName
		defaultValue
		placeholder
		errorMessage
		labelPosition
		instructionsPosition
		cssClasses
		enableConditions
		conditions
		enableContentEncryption
		visibility
		containerAttributes {
			label
			value
		}
		inputAttributes {
			label
			value
		}
		... on Field_Checkboxes {
			multi
			options {
				value
				label
				isDefault
				disabled
				isOptgroup
			}
		}
		... on Field_Agree {
			descriptionHtml
			checkedValue
			uncheckedValue
			defaultState
		}
		... on Field_Address {
			fields {
				conditions
				cssClasses
				defaultValue
				displayName
				emailValue
				enabled
				enableConditions
				enableContentEncryption
				errorMessage
				handle
				id
				includeInEmail
				inputTypeName
				instructions
				instructionsPosition
				label
				labelPosition
				matchField
				placeholder
				typeName
				type
				required
				prePopulate
				visibility
				uid
				... on Field_AddressCountry {
					id
					options {
						label
						value
						isDefault
					}
					defaultValue
					prePopulate
					required
				}
			}
		}

		... on Field_Dropdown {
			options {
				label
				value
				isDefault
			}
			multi
		}
		... on Field_Heading {
			headingSize
		}
		... on Field_SingleLineText {
			limit
			min
			max
		}
		... on Field_MultiLineText {
			limit
			min
			max
		}

		... on Field_FileUpload {
			limitFiles
			sizeLimit
			allowedKinds
			sizeMinLimit
		}

		... on Field_Name {
			useMultipleFields
			fields {
				label
				placeholder
				handle
				required
			}
		}
		... on Field_Date {
			minDate
			maxDate
			availableDaysOfWeek
			nestedRows {
				rowFields {
					id
					handle
					enabled
					label
					required
				}
			}
		}

		... on Field_Number {
			min
			minValue
			max
			maxValue
		}

		... on Field_Phone {
			countryEnabled
			countryDefaultValue
			countryAllowed
			countryOptions {
				label
				value
			}
		}

		... on Field_Radio {
			options {
				label
				value
				isDefault
				disabled
			}
		}
	}
`;

export const FormFragment = gql`
	${FieldFragment}

	fragment FormFragment on FormInterface {
		id
		title
		handle
		siteId

		csrfToken {
			name
			value
		}

		captchas {
			handle
			name
			value
		}

		settings {
			displayFormTitle
			displayPageTabs
			displayCurrentPageTitle
			displayPageProgress
			submitMethod
			submitAction
			submitActionTab
			#submitActionUrl
			submitActionFormHide
			submitActionMessageHtml
			submitActionMessageTimeout
			redirectUrl
			errorMessageHtml
			loadingIndicator
			loadingIndicatorText
			validationOnSubmit
			validationOnFocus
			defaultLabelPosition
			defaultInstructionsPosition
			progressPosition

			integrations {
				settings
			}

			redirectEntry {
				id
				uri
				slug
				sectionHandle
			}
		}

		pages {
			id
			label

			settings {
				submitButtonLabel
				backButtonLabel
				showBackButton
				buttonsPosition
				enablePageConditions
				pageConditions
			}

			rows {
				rowFields {
					...FieldFragment
				}
			}
		}
	}
`;

export const FormQuery = gql`
	query ($handle: [String], $siteHandle: [String]) {
		form: formieForm(handle: $handle, site: $siteHandle) {
			...FormFragment
		}
	}

	${FormFragment}
`;
