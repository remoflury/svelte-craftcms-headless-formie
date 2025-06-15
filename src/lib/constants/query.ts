import type { FieldProps } from '$lib/types/FieldTypes.js';

export const BASE_FIELD_VALUES = `
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
`;

const CHECKBOX_QUERY_PART = `
... on Field_Checkboxes {
${BASE_FIELD_VALUES}
  multi
  options {
    value
    label
    isDefault
    disabled
    isOptgroup
  }
}
`;

const AGREE_QUERY_PART = `
... on Field_Agree {
${BASE_FIELD_VALUES}

  descriptionHtml
  checkedValue
  uncheckedValue
  defaultState
}
`;
const ADDRESS_QUERY_PART = `
... on Field_Address {
${BASE_FIELD_VALUES}

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
`;
const DROPDOWN_QUERY_PART = `
... on Field_Dropdown {
${BASE_FIELD_VALUES}

  options {
    label
    value
    isDefault
  }
  multi
  }
`;
const HEADING_QUERY_PART = `
... on Field_Heading {
${BASE_FIELD_VALUES}

  headingSize
}`;
const SINGLELINETEXT_QUERY_PART = `
... on Field_SingleLineText {
${BASE_FIELD_VALUES}

  limit
  min
  max
}
`;
const FILEUPLOAD_QUERY_PART = `
... on Field_FileUpload {
${BASE_FIELD_VALUES}

  limitFiles
  sizeLimit
  allowedKinds
  sizeMinLimit
}
`;
const MULTILINE_QUERY_PART = `
... on Field_MultiLineText {
${BASE_FIELD_VALUES}

  limit
  min
  max
}
`;
const NAME_QUERY_PART = `
... on Field_Name {
${BASE_FIELD_VALUES}
  useMultipleFields
  fields {
    label
    placeholder
    handle
    required
  }
}
`;
const DATE_QUERY_PART = `
... on Field_Date {
${BASE_FIELD_VALUES}

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
`;
const NUMBER_QUERY_PART = `
... on Field_Number {
${BASE_FIELD_VALUES}

  min
  minValue
  max
  maxValue
}
`;
const PHONE_QUERY_PART = `
... on Field_Phone {
${BASE_FIELD_VALUES}

  countryEnabled
  countryDefaultValue
  countryAllowed
  countryOptions {
    label
    value
  }
}
`;

const RADIO_QUERY_PART = `
... on Field_Radio {
${BASE_FIELD_VALUES}

  options {
    label
    value
    isDefault
    disabled
  }
}
`;

export const FORM_FRAGMENT_VALUES = `
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

export const FIELD_GQL_MAP: Readonly<Record<FieldProps['displayName'], string>> = {
	Address: ADDRESS_QUERY_PART,
	Agree: AGREE_QUERY_PART,
	Checkboxes: CHECKBOX_QUERY_PART,
	Date: DATE_QUERY_PART,
	Dropdown: DROPDOWN_QUERY_PART,
	Email: '',
	FileUpload: FILEUPLOAD_QUERY_PART,
	Heading: HEADING_QUERY_PART,
	HiddenField: '',
	MultiLineText: MULTILINE_QUERY_PART,
	Name: NAME_QUERY_PART,
	Number: NUMBER_QUERY_PART,
	Phone: PHONE_QUERY_PART,
	Radio: RADIO_QUERY_PART,
	SingleLineText: SINGLELINETEXT_QUERY_PART
};
