import { FormState, SubmitFormResponse } from '../types/form';

// Mock API base URL
const API_BASE_URL = 'https://jsonplaceholder.typicode.com';

// Simulate network delay
const simulateDelay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Mock submit form API
export const submitFormAPI = async (formData: FormState): Promise<SubmitFormResponse> => {
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
  } catch (error) {
    console.error('Error submitting form:', error);
    return {
      success: false,
      message: 'Failed to submit form. Please try again.',
    };
  }
};

// Mock sync offline forms API
export const syncOfflineFormsAPI = async (forms: FormState[]): Promise<SubmitFormResponse[]> => {
  try {
    // Simulate network delay
    await simulateDelay(1500);

    // Mock sync all forms
    const results = await Promise.all(
      forms.map(async (formData) => {
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
      })
    );

    return results;
  } catch (error) {
    console.error('Error syncing offline forms:', error);
    return forms.map(() => ({
      success: false,
      message: 'Network error. Please try again.',
    }));
  }
};

// Check network connectivity (simplified)
export const isNetworkAvailable = (): Promise<boolean> => {
  return new Promise((resolve) => {
    // Simple network check - try to fetch a small resource
    fetch('https://jsonplaceholder.typicode.com/posts/1', {
      method: 'HEAD',
      cache: 'no-cache',
    })
    .then(() => resolve(true))
    .catch(() => resolve(false));
  });
};
