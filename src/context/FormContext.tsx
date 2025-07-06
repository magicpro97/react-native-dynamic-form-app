import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { FormState, FormAction, FormErrors } from '../types/form';

interface FormContextType {
  formState: FormState;
  errors: FormErrors;
  dispatch: React.Dispatch<FormAction>;
  setField: (name: string, value: any) => void;
  setMultipleFields: (fields: { [key: string]: any }) => void;
  resetForm: () => void;
  setError: (name: string, error: string) => void;
  clearError: (name: string) => void;
  clearAllErrors: () => void;
  hasErrors: () => boolean;
  getFieldError: (name: string) => string | undefined;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

// Form reducer
const formReducer = (state: FormState, action: FormAction): FormState => {
  switch (action.type) {
    case 'SET_FIELD':
      return {
        ...state,
        [action.payload!.name!]: action.payload!.value,
      };
    case 'SET_MULTIPLE_FIELDS':
      return {
        ...state,
        ...action.payload!.fields,
      };
    case 'RESET_FORM':
      return {};
    default:
      return state;
  }
};

// Error reducer
const errorReducer = (state: FormErrors, action: any): FormErrors => {
  switch (action.type) {
    case 'SET_ERROR':
      return {
        ...state,
        [action.payload.name]: action.payload.error,
      };
    case 'CLEAR_ERROR': {
      const newState = { ...state };
      delete newState[action.payload.name];
      return newState;
    }
    case 'RESET_ERRORS':
      return {};
    default:
      return state;
  }
};

// Form Provider
export const FormProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [formState, dispatch] = useReducer(formReducer, {});
  const [errors, errorDispatch] = useReducer(errorReducer, {});

  const setField = (name: string, value: any) => {
    dispatch({
      type: 'SET_FIELD',
      payload: { name, value },
    });
    // Clear error when field is updated
    if (errors[name]) {
      errorDispatch({ type: 'CLEAR_ERROR', payload: { name } });
    }
  };

  const setMultipleFields = (fields: { [key: string]: any }) => {
    dispatch({
      type: 'SET_MULTIPLE_FIELDS',
      payload: { fields },
    });
  };

  const resetForm = () => {
    dispatch({ type: 'RESET_FORM' });
    errorDispatch({ type: 'RESET_ERRORS' });
  };

  const setError = (name: string, error: string) => {
    errorDispatch({
      type: 'SET_ERROR',
      payload: { name, error },
    });
  };

  const clearError = (name: string) => {
    errorDispatch({
      type: 'CLEAR_ERROR',
      payload: { name },
    });
  };

  const clearAllErrors = () => {
    errorDispatch({ type: 'RESET_ERRORS' });
  };

  const hasErrors = () => {
    return Object.keys(errors).length > 0;
  };

  const getFieldError = (name: string) => {
    return errors[name];
  };

  return (
    <FormContext.Provider
      value={{
        formState,
        errors,
        dispatch,
        setField,
        setMultipleFields,
        resetForm,
        setError,
        clearError,
        clearAllErrors,
        hasErrors,
        getFieldError,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};

// Custom hook to use form context
export const useForm = () => {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error('useForm must be used within a FormProvider');
  }
  return context;
};
