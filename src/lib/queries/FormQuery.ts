import gql from 'graphql-tag';

export const FieldFragment = gql`
	fragment FieldFragment on FieldInterface {
		label
		handle
		instructions
		required
		type
		displayName
		typeName
		inputTypeName
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
			id
			multi
			options {
				value
				label
				isDefault
				disabled
				isOptgroup
			}
			conditions
			cssClasses
			defaultValue
			displayName
			emailValue
			enableConditions
			enableContentEncryption
			enabled
			errorMessage
			handle
			includeInEmail
			inputAttributes {
				label
				value
			}
			inputTypeName
			instructions
			instructionsPosition
			label
			labelPosition
			layout
			matchField
			placeholder
			prePopulate
			required
			typeName
			type
			uid
			visibility
		}
		... on Field_Agree {
			descriptionHtml
			checkedValue
			uncheckedValue
			defaultState
		}
		... on Field_Address {
			id
			fields {
				id
				label
				placeholder
				instructions
				displayName
				emailValue
				typeName
				type
				inputTypeName
				required
				handle
				conditions
				cssClasses
				defaultValue
				enableConditions
				enableContentEncryption
				enabled
				errorMessage
				includeInEmail
				instructionsPosition
				labelPosition
				matchField
				prePopulate
				uid
				visibility
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
		... on Field_MultiLineText {
			defaultValue
		}
		... on Field_SingleLineText {
			defaultValue
		}
		... on Field_Email {
			defaultValue
		}
		... on Field_Dropdown {
			defaultValue
			options {
				label
				value
				isDefault
			}
		}
		... on Field_Heading {
			headingSize
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
			datePickerOptions {
				label
				value
			}
		}
		... on Field_Number {
			min
			max
		}

		... on Field_Phone {
			defaultValue
			countryEnabled
			countryDefaultValue
			countryAllowed
			countryOptions {
				label
				value
			}
		}

		... on Field_Radio {
			layout

			options {
				label
				value
				isDefault
				disabled
			}
		}

		... on Field_SingleLineText {
			defaultValue
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
