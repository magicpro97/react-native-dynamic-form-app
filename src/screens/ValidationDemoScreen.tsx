import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { FormProvider } from '../context/FormContext';
import { DynamicField } from '../components/form/DynamicField';
import { Button } from '../components/ui';
import { useValidation } from '../hooks/useValidation';
import { customerRegistrationFields } from '../config/formConfigurations';
import { Card } from '../components/ui';

const FormWithValidation: React.FC = () => {
  const { validateAllFields } = useValidation(customerRegistrationFields);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    
    try {
      const isValid = validateAllFields();
      
      if (isValid) {
        Alert.alert('Success', 'Form submitted successfully!');
      } else {
        Alert.alert('Validation Error', 'Please check the form and fix any errors.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while submitting the form.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Card style={styles.formCard}>
          <Text style={styles.title}>Customer Registration</Text>
          <Text style={styles.subtitle}>
            This form demonstrates advanced validation with business logic
          </Text>
          
          {customerRegistrationFields.map((field) => (
            <DynamicField key={field.name} field={field} />
          ))}
          
          <Button
            title={submitting ? 'Submitting...' : 'Submit Registration'}
            onPress={handleSubmit}
            disabled={submitting}
            style={styles.submitButton}
          />
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export const ValidationDemoScreen: React.FC = () => {
  return (
    <FormProvider>
      <FormWithValidation />
    </FormProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    padding: 16,
  },
  formCard: {
    padding: 24,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  submitButton: {
    marginTop: 24,
  },
});
