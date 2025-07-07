import { useState, useEffect } from 'react';
import {
  FormConfiguration,
  FormListResponse,
  fetchFormConfigurations,
  fetchFormConfigurationById,
  fetchFormConfigurationByName,
  createFormConfiguration,
  updateFormConfiguration,
  deleteFormConfiguration,
  searchFormConfigurations,
  validateFormConfiguration,
} from '../services/api';

// Hook to fetch form configurations list
export const useFormConfigurations = (page = 1, limit = 10) => {
  const [data, setData] = useState<FormListResponse['data'] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchFormConfigurations(page, limit);
      if (response.success) {
        setData(response.data);
      } else {
        setError(response.message);
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, limit]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
};

// Hook to fetch a single form configuration
export const useFormConfiguration = (id: string | null) => {
  const [data, setData] = useState<FormConfiguration | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!id) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetchFormConfigurationById(id);
      if (response.success) {
        setData(response.data);
      } else {
        setError(response.message);
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
};

// Hook to fetch form configuration by name
export const useFormConfigurationByName = (name: string | null) => {
  const [data, setData] = useState<FormConfiguration | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!name) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetchFormConfigurationByName(name);
      if (response.success) {
        setData(response.data);
      } else {
        setError(response.message);
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [name]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
};

// Hook for form configuration CRUD operations
export const useFormConfigurationActions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createForm = async (
    formData: Omit<FormConfiguration, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    setLoading(true);
    setError(null);
    try {
      // Validate form configuration
      const validation = validateFormConfiguration({
        ...formData,
        id: '',
        createdAt: '',
        updatedAt: '',
      });

      if (!validation.isValid) {
        setError(validation.errors.join(', '));
        return { success: false, data: null };
      }

      const response = await createFormConfiguration(formData);
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        setError(response.message);
        return { success: false, data: null };
      }
    } catch {
      setError('An unexpected error occurred');
      return { success: false, data: null };
    } finally {
      setLoading(false);
    }
  };

  const updateForm = async (
    id: string,
    formData: Partial<FormConfiguration>
  ) => {
    setLoading(true);
    setError(null);
    try {
      const response = await updateFormConfiguration(id, formData);
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        setError(response.message);
        return { success: false, data: null };
      }
    } catch {
      setError('An unexpected error occurred');
      return { success: false, data: null };
    } finally {
      setLoading(false);
    }
  };

  const deleteForm = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await deleteFormConfiguration(id);
      if (response.success) {
        return { success: true };
      } else {
        setError(response.message);
        return { success: false };
      }
    } catch {
      setError('An unexpected error occurred');
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return {
    createForm,
    updateForm,
    deleteForm,
    loading,
    error,
  };
};

// Hook to search form configurations
export const useFormConfigurationSearch = () => {
  const [results, setResults] = useState<FormListResponse['data'] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = async (query: string, page = 1, limit = 10) => {
    if (!query.trim()) {
      setResults(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await searchFormConfigurations(query, page, limit);
      if (response.success) {
        setResults(response.data);
      } else {
        setError(response.message);
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setResults(null);
    setError(null);
  };

  return {
    results,
    loading,
    error,
    search,
    clearResults,
  };
};

// Hook for form configuration validation
export const useFormConfigurationValidation = () => {
  const validateForm = (config: FormConfiguration) => {
    return validateFormConfiguration(config);
  };

  return {
    validateForm,
  };
};
