import { FormField, FormState, FormValidation } from '../types/form';

export const validateForm = (
  formConfig: FormField[],
  formState: FormState
): FormValidation => {
  const errors: { [key: string]: string } = {};

  formConfig.forEach(field => {
    const value = formState[field.name];

    if (field.required) {
      // Handle different field types for required validation
      let isEmpty = false;

      if (Array.isArray(value)) {
        isEmpty = value.length === 0;
      } else if (typeof value === 'string') {
        isEmpty = !value.trim();
      } else {
        isEmpty = !value;
      }

      if (isEmpty) {
        errors[field.name] = `${field.label} is required`;
      }
    }

    // Email validation
    if (field.type === 'email' && value && typeof value === 'string') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        errors[field.name] = 'Please enter a valid email address';
      }
    }

    // Number validation
    if (field.type === 'number' && value) {
      if (isNaN(Number(value))) {
        errors[field.name] = 'Please enter a valid number';
      }
    }

    // Signature validation - check if signature exists
    if (field.type === 'signature' && field.required && value) {
      if (typeof value === 'string' && value.length < 100) {
        errors[field.name] = 'Please provide a signature';
      }
    }

    // Photo validation - check if photo exists
    if (field.type === 'photo' && field.required && value) {
      if (
        typeof value === 'string' &&
        !value.startsWith('data:') &&
        !value.startsWith('file://')
      ) {
        errors[field.name] = 'Please take or select a photo';
      }
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const getFieldValue = (
  field: FormField,
  formState: FormState
): string | number | boolean | File | null => {
  const value = formState[field.name];

  switch (field.type) {
    case 'checkbox':
      return value || null;
    case 'radio':
    case 'select':
      return value || '';
    case 'signature':
    case 'photo':
      return value || '';
    default:
      return value || '';
  }
};

export const formatFormData = (
  formConfig: FormField[],
  formState: FormState
): Record<string, unknown> => {
  const formattedData: Record<string, unknown> = {};

  formConfig.forEach(field => {
    const value = getFieldValue(field, formState);

    // Add metadata for special fields
    if (field.type === 'signature' || field.type === 'photo') {
      formattedData[field.name] = {
        type: field.type,
        value: value,
        timestamp: Date.now(),
      };
    } else {
      formattedData[field.name] = value;
    }
  });

  // Add form metadata
  formattedData._metadata = {
    submittedAt: new Date().toISOString(),
    formVersion: '1.0',
    platform: 'web', // or 'mobile'
  };

  return formattedData;
};
