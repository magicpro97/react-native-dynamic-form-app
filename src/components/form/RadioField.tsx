import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FormField } from '../../types/form';
import { useForm } from '../../context/FormContext';

interface RadioFieldProps {
  field: FormField;
}

export const RadioField: React.FC<RadioFieldProps> = ({ field }) => {
  const { formState, setField, errors } = useForm();
  const value = formState[field.name] || '';
  const error = errors[field.name];

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {field.label}
        {field.required && <Text style={styles.required}> *</Text>}
      </Text>
      <View style={styles.optionsContainer}>
        {field.options?.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={styles.option}
            onPress={() => setField(field.name, option.value)}
          >
            <View style={styles.radioContainer}>
              <View style={[styles.radioOuter, error && styles.radioError]}>
                {value === option.value && <View style={styles.radioInner} />}
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
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  radioError: {
    borderColor: '#ff4444',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#007AFF',
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
