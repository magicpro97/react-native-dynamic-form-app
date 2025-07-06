import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Button,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { FormProvider, useForm } from '../context/FormContext';
import { DynamicField } from '../components/form/DynamicField';
import { FormConfig } from '../types/form';
import { validateForm, formatFormData } from '../utils/formValidation';
import { saveOfflineForm } from '../utils/storage';
import { submitFormAPI } from '../services/api';
import formData from '../assets/form.json';

const FormContent: React.FC = () => {
  const { formState, setError, resetForm } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formConfig: FormConfig = formData as FormConfig;
  const router = useRouter();

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Validate form
      const validation = validateForm(formConfig.fields, formState);

      if (!validation.isValid) {
        // Set validation errors
        Object.keys(validation.errors).forEach(fieldName => {
          setError(fieldName, validation.errors[fieldName]);
        });
        Alert.alert(
          'Validation Error',
          'Please correct the errors and try again.',
        );
        return;
      }

      // Format form data
      const submissionData = formatFormData(formConfig.fields, formState);

      // Save to offline storage first
      const formId = saveOfflineForm(submissionData, formConfig.title);
      const submissionTime = Date.now();

      try {
        // Try to submit online
        const response = await submitFormAPI(submissionData);

        if (response.success) {
          console.log('Form submitted successfully:', response.data);

          // Navigate to success screen
          router.push({
            pathname: '/success',
            params: {
              formTitle: formConfig.title,
              submissionTime: submissionTime.toString(),
            },
          });

          // Reset form
          resetForm();
        } else {
          Alert.alert(
            'Submission Failed',
            response.message + ' Form has been saved locally.',
          );
        }
      } catch (error) {
        console.error('Online submission failed:', error);
        Alert.alert(
          'Saved Offline',
          'Unable to submit online right now. Your form has been saved locally and will be synced when connection is available.',
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to save form. Please try again.');
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    Alert.alert('Reset Form', 'Are you sure you want to reset all fields?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reset', onPress: resetForm, style: 'destructive' },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.title}>{formConfig.title}</Text>

        <View style={styles.form}>
          {formConfig.fields.map(field => (
            <DynamicField key={field.name} field={field} />
          ))}
        </View>

        <View style={styles.actions}>
          <Button
            title={isSubmitting ? 'Submitting...' : 'Submit Form'}
            onPress={handleSubmit}
            disabled={isSubmitting}
          />
          <View style={styles.spacing} />
          <Button
            title='Reset Form'
            onPress={handleReset}
            color='#ff4444'
            disabled={isSubmitting}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default function FormScreen() {
  return (
    <FormProvider>
      <FormContent />
    </FormProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
    color: '#333',
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actions: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  spacing: {
    height: 12,
  },
});
