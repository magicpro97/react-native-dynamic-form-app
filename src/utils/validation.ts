import { FormState, FormField } from '../types/form';

// Validation rule types
export interface ValidationRule {
  type:
    | 'required'
    | 'email'
    | 'phone'
    | 'minLength'
    | 'maxLength'
    | 'pattern'
    | 'custom'
    | 'conditional';
  message: string;
  value?: any;
  validator?: (value: any, formState: FormState) => boolean;
  condition?: (formState: FormState) => boolean;
}

// Field configuration with custom validation
export interface FieldConfig extends FormField {
  validation?: ValidationRule[];
  customValidation?: (value: any, formState: FormState) => string | null;
  dependsOn?: string[]; // Other fields this field depends on
}

// Built-in validation functions
export const validators = {
  required: (value: any) => {
    if (typeof value === 'string') {
      return value.trim().length > 0;
    }
    return value !== null && value !== undefined && value !== '';
  },

  email: (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  },

  phone: (value: string) => {
    const phoneRegex = /^[+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(value.replace(/\s/g, ''));
  },

  minLength: (value: string, minLength: number) => {
    return value.length >= minLength;
  },

  maxLength: (value: string, maxLength: number) => {
    return value.length <= maxLength;
  },

  pattern: (value: string, pattern: RegExp) => {
    return pattern.test(value);
  },

  // Custom validators for business logic
  age: (value: string) => {
    const age = parseInt(value);
    return age >= 0 && age <= 120;
  },

  positiveNumber: (value: string) => {
    const num = parseFloat(value);
    return !isNaN(num) && num > 0;
  },

  currency: (value: string) => {
    const currencyRegex = /^\d+(\.\d{1,2})?$/;
    return currencyRegex.test(value);
  },

  date: (value: string) => {
    const date = new Date(value);
    return !isNaN(date.getTime());
  },

  futureDate: (value: string) => {
    const date = new Date(value);
    const today = new Date();
    return date > today;
  },

  pastDate: (value: string) => {
    const date = new Date(value);
    const today = new Date();
    return date < today;
  },
};

// Main validation function
export const validateField = (
  fieldName: string,
  value: any,
  fieldConfig: FieldConfig,
  formState: FormState
): string | null => {
  // Skip validation if field is empty and not required
  if (!fieldConfig.validation || fieldConfig.validation.length === 0) {
    return null;
  }

  for (const rule of fieldConfig.validation) {
    // Check conditional validation
    if (rule.condition && !rule.condition(formState)) {
      continue;
    }

    let isValid = true;
    const errorMessage = rule.message;

    switch (rule.type) {
      case 'required':
        isValid = validators.required(value);
        break;

      case 'email':
        if (value && typeof value === 'string') {
          isValid = validators.email(value);
        }
        break;

      case 'phone':
        if (value && typeof value === 'string') {
          isValid = validators.phone(value);
        }
        break;

      case 'minLength':
        if (value && typeof value === 'string') {
          isValid = validators.minLength(value, rule.value);
        }
        break;

      case 'maxLength':
        if (value && typeof value === 'string') {
          isValid = validators.maxLength(value, rule.value);
        }
        break;

      case 'pattern':
        if (value && typeof value === 'string') {
          isValid = validators.pattern(value, rule.value);
        }
        break;

      case 'custom':
        if (rule.validator) {
          isValid = rule.validator(value, formState);
        }
        break;

      case 'conditional':
        if (rule.condition && rule.condition(formState)) {
          if (rule.validator) {
            isValid = rule.validator(value, formState);
          }
        }
        break;

      default:
        isValid = true;
    }

    if (!isValid) {
      return errorMessage;
    }
  }

  // Run custom validation if provided
  if (fieldConfig.customValidation) {
    const customError = fieldConfig.customValidation(value, formState);
    if (customError) {
      return customError;
    }
  }

  return null;
};

// Validate entire form
export const validateForm = (
  formState: FormState,
  fieldConfigs: FieldConfig[]
): { [key: string]: string } => {
  const errors: { [key: string]: string } = {};

  for (const config of fieldConfigs) {
    const error = validateField(
      config.name,
      formState[config.name],
      config,
      formState
    );
    if (error) {
      errors[config.name] = error;
    }
  }

  return errors;
};

// Business logic validation examples
export const businessValidators = {
  // Age validation based on other fields
  validateAge: (age: string, formState: FormState) => {
    const ageNum = parseInt(age);
    const category = formState.category;

    if (category === 'child' && ageNum >= 18) {
      return 'Age must be under 18 for child category';
    }
    if (category === 'adult' && ageNum < 18) {
      return 'Age must be 18 or older for adult category';
    }
    return null;
  },

  // Salary validation based on position
  validateSalary: (salary: string, formState: FormState) => {
    const salaryNum = parseFloat(salary);
    const position = formState.position;

    const minSalaries: { [key: string]: number } = {
      intern: 1000,
      junior: 3000,
      senior: 5000,
      manager: 8000,
    };

    const minSalary = minSalaries[position];
    if (minSalary && salaryNum < minSalary) {
      return `Minimum salary for ${position} is $${minSalary}`;
    }
    return null;
  },

  // Date range validation
  validateDateRange: (endDate: string, formState: FormState) => {
    const start = new Date(formState.startDate);
    const end = new Date(endDate);

    if (end <= start) {
      return 'End date must be after start date';
    }
    return null;
  },

  // Password confirmation
  validatePasswordConfirmation: (
    confirmPassword: string,
    formState: FormState
  ) => {
    if (confirmPassword !== formState.password) {
      return 'Passwords do not match';
    }
    return null;
  },

  // Credit card validation
  validateCreditCard: (cardNumber: string, formState: FormState) => {
    // Luhn algorithm
    const digits = cardNumber.replace(/\s/g, '').split('').map(Number);
    let sum = 0;
    let isEven = false;

    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = digits[i];
      if (isEven) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      isEven = !isEven;
    }

    if (sum % 10 !== 0) {
      return 'Invalid credit card number';
    }
    return null;
  },

  // File size validation
  validateFileSize: (file: any, formState: FormState) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file && file.size > maxSize) {
      return 'File size must be less than 5MB';
    }
    return null;
  },

  // Signature validation
  validateSignature: (signature: string, formState: FormState) => {
    if (!signature || signature.trim().length === 0) {
      return 'Signature is required';
    }
    // Check if signature is just the default/empty signature
    if (
      signature ===
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=='
    ) {
      return 'Please provide a valid signature';
    }
    return null;
  },
};

// Form validation configuration examples
export const exampleFieldConfigs: FieldConfig[] = [
  {
    name: 'email',
    label: 'Email Address',
    type: 'email',
    required: true,
    validation: [
      {
        type: 'required',
        message: 'Email is required',
      },
      {
        type: 'email',
        message: 'Please enter a valid email address',
      },
    ],
  },
  {
    name: 'age',
    label: 'Age',
    type: 'number',
    required: true,
    validation: [
      {
        type: 'required',
        message: 'Age is required',
      },
      {
        type: 'custom',
        message: 'Age must be between 0 and 120',
        validator: value => validators.age(value),
      },
    ],
    customValidation: businessValidators.validateAge,
    dependsOn: ['category'],
  },
  {
    name: 'salary',
    label: 'Expected Salary',
    type: 'number',
    required: true,
    validation: [
      {
        type: 'required',
        message: 'Salary is required',
      },
      {
        type: 'custom',
        message: 'Please enter a valid amount',
        validator: value => validators.positiveNumber(value),
      },
    ],
    customValidation: businessValidators.validateSalary,
    dependsOn: ['position'],
  },
  {
    name: 'confirmPassword',
    label: 'Confirm Password',
    type: 'password',
    required: true,
    validation: [
      {
        type: 'required',
        message: 'Please confirm your password',
      },
    ],
    customValidation: businessValidators.validatePasswordConfirmation,
    dependsOn: ['password'],
  },
  {
    name: 'signature',
    label: 'Digital Signature',
    type: 'signature',
    required: true,
    validation: [
      {
        type: 'required',
        message: 'Signature is required',
      },
    ],
    customValidation: businessValidators.validateSignature,
  },
  {
    name: 'agreeTerms',
    label: 'I agree to the terms and conditions',
    type: 'checkbox',
    required: true,
    validation: [
      {
        type: 'conditional',
        message: 'You must agree to the terms and conditions',
        condition: formState => formState.userType === 'premium',
        validator: value => value === true,
      },
    ],
  },
];
