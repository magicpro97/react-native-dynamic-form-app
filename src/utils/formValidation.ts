import { FormField, FormState, FormValidation } from '../types/form';

export const validateForm = (formConfig: FormField[], formState: FormState): FormValidation => {
  const errors: { [key: string]: string } = {};

  formConfig.forEach((field) => {
    const value = formState[field.name];
    
    if (field.required) {
      if (!value || (Array.isArray(value) && value.length === 0)) {
        errors[field.name] = `${field.label} is required`;
      }
    }

    // Email validation
    if (field.type === 'email' && value) {
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
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const getFieldValue = (field: FormField, formState: FormState): any => {
  const value = formState[field.name];
  
  switch (field.type) {
    case 'checkbox':
      return value || [];
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

export const formatFormData = (formConfig: FormField[], formState: FormState): any => {
  const formattedData: any = {};
  
  formConfig.forEach((field) => {
    const value = getFieldValue(field, formState);
    formattedData[field.name] = value;
  });
  
  return formattedData;
};
