// Form field types
export interface FormFieldOption {
  label: string;
  value: string;
}

export interface FormField {
  name: string;
  label: string;
  type:
    | 'text'
    | 'email'
    | 'number'
    | 'password'
    | 'radio'
    | 'checkbox'
    | 'select'
    | 'signature'
    | 'photo';
  required: boolean;
  placeholder?: string;
  options?: FormFieldOption[];
}

export interface FormConfig {
  title: string;
  fields: FormField[];
}

// Form state types
export interface FormState {
  [key: string]: string | number | boolean | File | null;
}

export interface FormAction {
  type: 'SET_FIELD' | 'SET_MULTIPLE_FIELDS' | 'RESET_FORM';
  payload?: {
    name?: string;
    value?: string | number | boolean | File | null;
    fields?: { [key: string]: string | number | boolean | File | null };
  };
}

// Form validation types
export interface FormErrors {
  [key: string]: string;
}

export interface FormValidation {
  isValid: boolean;
  errors: FormErrors;
}

// Offline storage types
export interface OfflineFormData {
  id: string;
  formData: FormState;
  timestamp: number;
  updatedAt: number;
  status: 'pending' | 'synced' | 'failed';
  formTitle: string;
  syncAttempts?: number;
}

export interface SubmitFormResponse {
  success: boolean;
  message: string;
  data?: Record<string, unknown>;
}
