import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { FormField } from '../../types/form';
import { useForm } from '../../context/FormContext';

interface SelectFieldProps {
  field: FormField;
}

export const SelectField: React.FC<SelectFieldProps> = ({ field }) => {
  const { formState, setField, errors } = useForm();
  const value = formState[field.name] || '';
  const error = errors[field.name];

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {field.label}
        {field.required && <Text style={styles.required}> *</Text>}
      </Text>
      <View style={[styles.pickerContainer, error && styles.pickerError]}>
        <Picker
          selectedValue={value}
          style={styles.picker}
          onValueChange={(itemValue) => setField(field.name, itemValue)}
        >
          <Picker.Item label="Select an option..." value="" />
          {field.options?.map((option) => (
            <Picker.Item
              key={option.value}
              label={option.label}
              value={option.value}
            />
          ))}
        </Picker>
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
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  pickerError: {
    borderColor: '#ff4444',
  },
  picker: {
    height: 50,
  },
  errorText: {
    color: '#ff4444',
    fontSize: 14,
    marginTop: 4,
  },
});
