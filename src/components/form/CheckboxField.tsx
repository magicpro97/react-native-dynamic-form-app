import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FormField } from '../../types/form';
import { useForm } from '../../context/FormContext';

interface CheckboxFieldProps {
  field: FormField;
}

export const CheckboxField: React.FC<CheckboxFieldProps> = ({ field }) => {
  const { formState, setField, errors } = useForm();
  const rawValue = formState[field.name] || [];
  const values: string[] = Array.isArray(rawValue) ? rawValue.map(String) : [];
  const error = errors[field.name];

  const handleToggle = (optionValue: string) => {
    const newValues = values.includes(optionValue)
      ? values.filter((v: string) => v !== optionValue)
      : [...values, optionValue];
    setField(field.name, newValues as unknown as string | number | boolean | File | null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {field.label}
        {field.required && <Text style={styles.required}> *</Text>}
      </Text>
      <View style={styles.optionsContainer}>
        {field.options?.map(option => (
          <TouchableOpacity
            key={option.value}
            style={styles.option}
            onPress={() => handleToggle(option.value)}
          >
            <View style={styles.checkboxContainer}>
              <View
                style={[styles.checkboxOuter, error && styles.checkboxError]}
              >
                {values.includes(option.value) && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </View>
              <Text style={styles.optionText}>{option.label}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  required: {
    color: '#ff4444',
  },
  optionsContainer: {
    gap: 8,
  },
  option: {
    marginBottom: 8,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxOuter: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    backgroundColor: '#fff',
  },
  checkboxError: {
    borderColor: '#ff4444',
  },
  checkmark: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 14,
    marginTop: 4,
  },
});
