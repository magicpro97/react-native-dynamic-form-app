import { MMKV } from 'react-native-mmkv';
import { OfflineFormData, FormState } from '../types/form';

// Initialize MMKV storage
const storage = new MMKV();

// Storage keys
const OFFLINE_FORMS_KEY = 'offline_forms';
const FORM_COUNTER_KEY = 'form_counter';

// Generate unique form ID
const generateFormId = (): string => {
  const counter = storage.getNumber(FORM_COUNTER_KEY) || 0;
  const newCounter = counter + 1;
  storage.set(FORM_COUNTER_KEY, newCounter);
  return `form_${Date.now()}_${newCounter}`;
};

// Get all offline forms
export const getOfflineForms = (): OfflineFormData[] => {
  try {
    const formsJson = storage.getString(OFFLINE_FORMS_KEY);
    if (!formsJson) return [];
    return JSON.parse(formsJson);
  } catch (error) {
    console.error('Error getting offline forms:', error);
    return [];
  }
};

// Save form to offline storage
export const saveOfflineForm = (formData: FormState, formTitle: string): string => {
  try {
    const formId = generateFormId();
    const newForm: OfflineFormData = {
      id: formId,
      formData,
      timestamp: Date.now(),
      status: 'pending',
      formTitle,
    };

    const existingForms = getOfflineForms();
    const updatedForms = [...existingForms, newForm];
    
    storage.set(OFFLINE_FORMS_KEY, JSON.stringify(updatedForms));
    return formId;
  } catch (error) {
    console.error('Error saving offline form:', error);
    throw error;
  }
};

// Update form status
export const updateFormStatus = (formId: string, status: 'pending' | 'synced' | 'failed'): void => {
  try {
    const forms = getOfflineForms();
    const updatedForms = forms.map(form => 
      form.id === formId ? { ...form, status } : form
    );
    storage.set(OFFLINE_FORMS_KEY, JSON.stringify(updatedForms));
  } catch (error) {
    console.error('Error updating form status:', error);
  }
};

// Delete offline form
export const deleteOfflineForm = (formId: string): void => {
  try {
    const forms = getOfflineForms();
    const updatedForms = forms.filter(form => form.id !== formId);
    storage.set(OFFLINE_FORMS_KEY, JSON.stringify(updatedForms));
  } catch (error) {
    console.error('Error deleting offline form:', error);
  }
};

// Get pending forms count
export const getPendingFormsCount = (): number => {
  try {
    const forms = getOfflineForms();
    return forms.filter(form => form.status === 'pending').length;
  } catch (error) {
    console.error('Error getting pending forms count:', error);
    return 0;
  }
};

// Clear all offline forms
export const clearAllOfflineForms = (): void => {
  try {
    storage.delete(OFFLINE_FORMS_KEY);
    storage.delete(FORM_COUNTER_KEY);
  } catch (error) {
    console.error('Error clearing offline forms:', error);
  }
};
