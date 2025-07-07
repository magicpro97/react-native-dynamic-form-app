import {
  FormState,
  SubmitFormResponse,
  OfflineFormData,
  FormField,
} from '../types/form';
import NetInfo from '@react-native-community/netinfo';

// Mock API base URL
const API_BASE_URL = 'https://jsonplaceholder.typicode.com';
// Form API endpoints
const FORM_API_BASE = 'https://api.example.com/forms'; // Replace with your actual API

// Types for form configuration responses
export interface FormConfiguration {
  id: string;
  name: string;
  title: string;
  description?: string;
  version: string;
  fields: FormField[];
  settings?: {
    allowOffline?: boolean;
    requireAuth?: boolean;
    maxFileSize?: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface FormListResponse {
  success: boolean;
  message: string;
  data: {
    forms: FormConfiguration[];
    total: number;
    page: number;
    limit: number;
  };
}

export interface FormDetailResponse {
  success: boolean;
  message: string;
  data: FormConfiguration;
}

// Simulate network delay
const simulateDelay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Mock submit form API
export const submitFormAPI = async (
  formData: FormState,
): Promise<SubmitFormResponse> => {
  try {
    // Simulate network delay (1-2 seconds)
    const delay = Math.random() * 1000 + 1000; // 1-2 seconds
    await simulateDelay(delay);

    // Mock API call to JSONPlaceholder
    const response = await fetch(`${API_BASE_URL}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: 'Form Submission',
        body: JSON.stringify(formData),
        userId: 1,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return {
      success: true,
      message: 'Form submitted successfully!',
      data,
    };
  } catch {
    return {
      success: false,
      message: 'Failed to submit form. Please try again.',
    };
  }
};

// Mock sync offline forms API
export const syncOfflineFormsAPI = async (
  forms: FormState[],
): Promise<SubmitFormResponse[]> => {
  try {
    // Simulate network delay
    await simulateDelay(1500);

    // Mock sync all forms
    const results = await Promise.all(
      forms.map(async (_formData) => {
        // Random success/failure for demo
        const success = Math.random() > 0.1; // 90% success rate

        if (success) {
          return {
            success: true,
            message: 'Form synced successfully!',
            data: { id: Math.random().toString() },
          };
        } else {
          return {
            success: false,
            message: 'Sync failed. Will retry later.',
          };
        }
      }),
    );

    return results;
  } catch {
    return forms.map(() => ({
      success: false,
      message: 'Network error. Please try again.',
    }));
  }
};

// Check network connectivity using NetInfo
export const isNetworkAvailable = async (): Promise<boolean> => {
  try {
    const netInfo = await NetInfo.fetch();
    return netInfo.isConnected === true && netInfo.isInternetReachable === true;
  } catch {
    
    return false;
  }
};

// Mock sync individual form API
export const syncFormAPI = async (
  form: OfflineFormData,
): Promise<{
  success: boolean;
  message: string;
  serverData?: OfflineFormData;
  action: 'upload' | 'download' | 'conflict';
}> => {
  try {
    // Simulate network delay
    await simulateDelay(500);

    // Mock server response - simulate different scenarios
    const scenarios = ['upload', 'download', 'conflict'];
    const randomScenario =
      scenarios[Math.floor(Math.random() * scenarios.length)];

    switch (randomScenario) {
      case 'upload':
        // Local is newer, upload to server
        return {
          success: true,
          message: 'Form uploaded successfully',
          action: 'upload',
        };

      case 'download': {
        // Server is newer, download from server
        const serverData: OfflineFormData = {
          ...form,
          formData: { ...form.formData, serverModified: true },
          updatedAt: Date.now() + 1000, // Make server newer
        };
        return {
          success: true,
          message: 'Server version is newer',
          action: 'download',
          serverData,
        };
      }

      case 'conflict':
        // Conflict scenario
        return {
          success: false,
          message: 'Sync conflict detected',
          action: 'conflict',
        };

      default:
        return {
          success: true,
          message: 'Form synced successfully',
          action: 'upload',
        };
    }
  } catch {
    
    return {
      success: false,
      message: 'Network error during sync',
      action: 'upload',
    };
  }
};

// Mock API to fetch form configurations
export const fetchFormConfigurations = async (
  page = 1,
  limit = 10,
): Promise<FormListResponse> => {
  try {
    // Simulate network delay
    await simulateDelay(1000);

    // Mock API response
    const response: FormListResponse = {
      success: true,
      message: 'Form configurations fetched successfully',
      data: {
        forms: [
          {
            id: '1',
            name: 'contact-us',
            title: 'Contact Us Form',
            description: 'Form for users to contact us',
            version: '1.0',
            fields: [
              {
                name: 'fullName',
                label: 'Full Name',
                type: 'text',
                required: true,
                placeholder: 'Enter your full name',
              },
              {
                name: 'email',
                label: 'Email Address',
                type: 'email',
                required: true,
                placeholder: 'Enter your email',
              },
              {
                name: 'message',
                label: 'Message',
                type: 'text',
                required: true,
                placeholder: 'Enter your message',
              },
            ],
            settings: {
              allowOffline: true,
              requireAuth: false,
              maxFileSize: 5 * 1024 * 1024, // 5 MB
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: '2',
            name: 'user-registration',
            title: 'User Registration Form',
            description: 'New user registration form',
            version: '1.1',
            fields: [
              {
                name: 'username',
                label: 'Username',
                type: 'text',
                required: true,
                placeholder: 'Choose a username',
              },
              {
                name: 'email',
                label: 'Email',
                type: 'email',
                required: true,
                placeholder: 'Enter your email',
              },
              {
                name: 'password',
                label: 'Password',
                type: 'password',
                required: true,
                placeholder: 'Enter a secure password',
              },
              {
                name: 'gender',
                label: 'Gender',
                type: 'radio',
                required: false,
                options: [
                  { label: 'Male', value: 'male' },
                  { label: 'Female', value: 'female' },
                  { label: 'Other', value: 'other' },
                ],
              },
            ],
            settings: {
              allowOffline: false,
              requireAuth: false,
              maxFileSize: 2 * 1024 * 1024, // 2 MB
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
        total: 2,
        page,
        limit,
      },
    };

    return response;
  } catch {
    
    return {
      success: false,
      message: 'Failed to fetch form configurations',
      data: {
        forms: [],
        total: 0,
        page,
        limit,
      },
    };
  }
};

// Mock API to fetch a single form configuration by ID
export const fetchFormConfigurationById = async (
  id: string,
): Promise<FormDetailResponse> => {
  try {
    // Simulate network delay
    await simulateDelay(1000);

    // Mock form configurations database
    const mockForms: { [key: string]: FormConfiguration } = {
      '1': {
        id: '1',
        name: 'contact-us',
        title: 'Contact Us Form',
        description: 'Form for users to contact us',
        version: '1.0',
        fields: [
          {
            name: 'fullName',
            label: 'Full Name',
            type: 'text',
            required: true,
            placeholder: 'Enter your full name',
          },
          {
            name: 'email',
            label: 'Email Address',
            type: 'email',
            required: true,
            placeholder: 'Enter your email',
          },
          {
            name: 'message',
            label: 'Message',
            type: 'text',
            required: true,
            placeholder: 'Enter your message',
          },
        ],
        settings: {
          allowOffline: true,
          requireAuth: false,
          maxFileSize: 5 * 1024 * 1024, // 5 MB
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      '2': {
        id: '2',
        name: 'user-registration',
        title: 'User Registration Form',
        description: 'New user registration form',
        version: '1.1',
        fields: [
          {
            name: 'username',
            label: 'Username',
            type: 'text',
            required: true,
            placeholder: 'Choose a username',
          },
          {
            name: 'email',
            label: 'Email',
            type: 'email',
            required: true,
            placeholder: 'Enter your email',
          },
          {
            name: 'password',
            label: 'Password',
            type: 'password',
            required: true,
            placeholder: 'Enter a secure password',
          },
          {
            name: 'gender',
            label: 'Gender',
            type: 'radio',
            required: false,
            options: [
              { label: 'Male', value: 'male' },
              { label: 'Female', value: 'female' },
              { label: 'Other', value: 'other' },
            ],
          },
        ],
        settings: {
          allowOffline: false,
          requireAuth: false,
          maxFileSize: 2 * 1024 * 1024, // 2 MB
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };

    const formConfig = mockForms[id];

    if (formConfig) {
      return {
        success: true,
        message: 'Form configuration fetched successfully',
        data: formConfig,
      };
    } else {
      return {
        success: false,
        message: 'Form configuration not found',
        data: {
          id: '',
          name: '',
          title: '',
          version: '',
          fields: [],
          createdAt: '',
          updatedAt: '',
        },
      };
    }
  } catch {
    
    return {
      success: false,
      message: 'Failed to fetch form configuration',
      data: {
        id: '',
        name: '',
        title: '',
        version: '',
        fields: [],
        createdAt: '',
        updatedAt: '',
      },
    };
  }
};

// API to create a new form configuration
export const createFormConfiguration = async (
  formData: Omit<FormConfiguration, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<FormDetailResponse> => {
  try {
    // Simulate network delay
    await simulateDelay(1500);

    // Mock API call to create form
    const response = await fetch(`${FORM_API_BASE}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer YOUR_AUTH_TOKEN', // Replace with actual token
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return {
      success: true,
      message: 'Form configuration created successfully',
      data: {
        ...formData,
        id: data.id || Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };
  } catch {
    
    return {
      success: false,
      message: 'Failed to create form configuration',
      data: {
        id: '',
        name: '',
        title: '',
        version: '',
        fields: [],
        createdAt: '',
        updatedAt: '',
      },
    };
  }
};

// API to update an existing form configuration
export const updateFormConfiguration = async (
  id: string,
  formData: Partial<FormConfiguration>,
): Promise<FormDetailResponse> => {
  try {
    // Simulate network delay
    await simulateDelay(1200);

    // Mock API call to update form
    const response = await fetch(`${FORM_API_BASE}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer YOUR_AUTH_TOKEN', // Replace with actual token
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return {
      success: true,
      message: 'Form configuration updated successfully',
      data: {
        ...data,
        updatedAt: new Date().toISOString(),
      },
    };
  } catch {
    
    return {
      success: false,
      message: 'Failed to update form configuration',
      data: {
        id: '',
        name: '',
        title: '',
        version: '',
        fields: [],
        createdAt: '',
        updatedAt: '',
      },
    };
  }
};

// API to delete a form configuration
export const deleteFormConfiguration = async (
  id: string,
): Promise<{ success: boolean; message: string }> => {
  try {
    // Simulate network delay
    await simulateDelay(800);

    // Mock API call to delete form
    const response = await fetch(`${FORM_API_BASE}/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer YOUR_AUTH_TOKEN', // Replace with actual token
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return {
      success: true,
      message: 'Form configuration deleted successfully',
    };
  } catch {
    
    return {
      success: false,
      message: 'Failed to delete form configuration',
    };
  }
};

// API to search form configurations
export const searchFormConfigurations = async (
  query: string,
  page = 1,
  limit = 10,
): Promise<FormListResponse> => {
  try {
    // Simulate network delay
    await simulateDelay(800);

    // Mock API call to search forms
    const response = await fetch(
      `${FORM_API_BASE}/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`,
      {
        method: 'GET',
        headers: {
          Authorization: 'Bearer YOUR_AUTH_TOKEN', // Replace with actual token
        },
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return {
      success: true,
      message: 'Form configurations searched successfully',
      data,
    };
  } catch {
    
    return {
      success: false,
      message: 'Failed to search form configurations',
      data: {
        forms: [],
        total: 0,
        page,
        limit,
      },
    };
  }
};

// API to get form configuration by name/slug
export const fetchFormConfigurationByName = async (
  name: string,
): Promise<FormDetailResponse> => {
  try {
    // Simulate network delay
    await simulateDelay(1000);

    // Mock API call to get form by name
    const response = await fetch(`${FORM_API_BASE}/by-name/${name}`, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer YOUR_AUTH_TOKEN', // Replace with actual token
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return {
      success: true,
      message: 'Form configuration fetched successfully',
      data,
    };
  } catch {
    
    return {
      success: false,
      message: 'Failed to fetch form configuration',
      data: {
        id: '',
        name: '',
        title: '',
        version: '',
        fields: [],
        createdAt: '',
        updatedAt: '',
      },
    };
  }
};

// Helper function to validate form configuration
export const validateFormConfiguration = (
  config: FormConfiguration,
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!config.name || config.name.trim() === '') {
    errors.push('Form name is required');
  }

  if (!config.title || config.title.trim() === '') {
    errors.push('Form title is required');
  }

  if (!config.fields || config.fields.length === 0) {
    errors.push('At least one field is required');
  }

  config.fields.forEach((field, fieldIndex) => {
    if (!field.name || field.name.trim() === '') {
      errors.push(`Field ${fieldIndex + 1}: Name is required`);
    }

    if (!field.label || field.label.trim() === '') {
      errors.push(`Field ${fieldIndex + 1}: Label is required`);
    }

    if (!field.type) {
      errors.push(`Field ${fieldIndex + 1}: Type is required`);
    }

    if (
      ['radio', 'checkbox', 'select'].includes(field.type) &&
      (!field.options || field.options.length === 0)
    ) {
      errors.push(
        `Field ${fieldIndex + 1}: Options are required for ${field.type} fields`,
      );
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
};
