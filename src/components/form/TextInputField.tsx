import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { FormField } from '../../types/form';
import { useForm } from '../../context/FormContext';

interface TextInputFieldProps {
  field: FormField;
}

export const TextInputField: React.FC<TextInputFieldProps> = ({ field }) => {
  const { formState, setField, errors } = useForm();
  const rawValue = formState[field.name] || '';
  const value = typeof rawValue === 'string' ? rawValue : String(rawValue || '');
  const error = errors[field.name];

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {field.label}
        {field.required && <Text style={styles.required}> *</Text>}
      </Text>
      <TextInput
        style={[styles.input, error && styles.inputError]}
        value={value}
        onChangeText={text => setField(field.name, text)}
        placeholder={field.placeholder}
        keyboardType={field.type === 'email' ? 'email-address' : 'default'}
        autoCapitalize={field.type === 'email' ? 'none' : 'words'}
      />
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
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: '#ff4444',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 14,
    marginTop: 4,
  },
});
