import { useCallback, useEffect } from 'react';
import { useForm } from '../context/FormContext';
import { FieldConfig, validateField, validateForm } from '../utils/validation';

export const useValidation = (fieldConfigs: FieldConfig[]) => {
  const { formState, setError, clearError } = useForm();

  // Validate a single field
  const validateSingleField = useCallback((fieldName: string, value: any) => {
    const fieldConfig = fieldConfigs.find(config => config.name === fieldName);
    if (!fieldConfig) return;

    const error = validateField(fieldName, value, fieldConfig, formState);
    if (error) {
      setError(fieldName, error);
    } else {
      clearError(fieldName);
    }
  }, [fieldConfigs, formState, setError, clearError]);

  // Validate fields that depend on the changed field
  const validateDependentFields = useCallback((changedFieldName: string) => {
    const dependentFields = fieldConfigs.filter(config => 
      config.dependsOn && config.dependsOn.includes(changedFieldName)
    );

    dependentFields.forEach(config => {
      const value = formState[config.name];
      const error = validateField(config.name, value, config, formState);
      if (error) {
        setError(config.name, error);
      } else {
        clearError(config.name);
      }
    });
  }, [fieldConfigs, formState, setError, clearError]);

  // Validate entire form
  const validateAllFields = useCallback(() => {
    const errors = validateForm(formState, fieldConfigs);
    
    // Clear all existing errors first
    fieldConfigs.forEach(config => clearError(config.name));
    
    // Set new errors
    Object.keys(errors).forEach(fieldName => {
      setError(fieldName, errors[fieldName]);
    });

    return Object.keys(errors).length === 0;
  }, [formState, fieldConfigs, setError, clearError]);

  // Auto-validate when form state changes
  useEffect(() => {
    // Debounce validation to avoid excessive calls
    const timeoutId = setTimeout(() => {
      // Only validate fields that have values or are required
      fieldConfigs.forEach(config => {
        const value = formState[config.name];
        if (value || config.required) {
          validateSingleField(config.name, value);
        }
      });
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [formState, fieldConfigs, validateSingleField]);

  return {
    validateSingleField,
    validateDependentFields,
    validateAllFields,
  };
};
