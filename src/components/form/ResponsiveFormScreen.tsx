import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { FormProvider, useForm } from '../../context/FormContext';
import { DynamicField } from './DynamicField';
import { FormConfig } from '../../types/form';
import { validateForm, formatFormData } from '../../utils/formValidation';
import { saveOfflineForm } from '../../utils/storage';
import { submitFormAPI } from '../../services/api';
import { useResponsive } from '../../hooks/useResponsive';
import { colors, spacing, borderRadius, fontSize, fontWeight, shadows } from '../../theme';
import { Card, Button, Typography } from '../ui';
import formData from '../../assets/form.json';

const ResponsiveFormContent: React.FC = () => {
  const { formState, setError, resetForm } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formConfig: FormConfig = formData as FormConfig;
  const router = useRouter();
  const { 
    isTablet, 
    isLandscape, 
    getColumns, 
    getPadding, 
    getFontSize, 
    getSpacing 
  } = useResponsive();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      const validation = validateForm(formConfig.fields, formState);
      
      if (!validation.isValid) {
        Object.keys(validation.errors).forEach((fieldName) => {
          setError(fieldName, validation.errors[fieldName]);
        });
        Alert.alert('Validation Error', 'Please correct the errors and try again.');
        return;
      }

      const submissionData = formatFormData(formConfig.fields, formState);
      const formId = saveOfflineForm(submissionData, formConfig.title);
      const submissionTime = Date.now();
      
      try {
        const response = await submitFormAPI(submissionData);
        
        if (response.success) {
          console.log('Form submitted successfully:', response.data);
          
          router.push({
            pathname: '/success',
            params: {
              formTitle: formConfig.title,
              submissionTime: submissionTime.toString(),
            },
          });
          
          resetForm();
        } else {
          Alert.alert('Submission Failed', response.message + ' Form has been saved locally.');
        }
      } catch (error) {
        console.error('Online submission failed:', error);
        Alert.alert(
          'Saved Offline',
          'Unable to submit online right now. Your form has been saved locally and will be synced when connection is available.'
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
    Alert.alert(
      'Reset Form',
      'Are you sure you want to reset all fields?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', onPress: resetForm, style: 'destructive' },
      ]
    );
  };

  const styles = getStyles(isTablet, isLandscape, getPadding, getFontSize, getSpacing);
  const columns = getColumns();

  // Render form fields in grid or list layout
  const renderFormField = ({ item, index }: { item: any; index: number }) => (
    <View style={[styles.fieldWrapper, { flex: isTablet && isLandscape ? 1 / columns : 1 }]}>
      <DynamicField key={item.name} field={item} />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView 
          style={styles.scrollView} 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Typography variant="h2" style={styles.title}>
              {formConfig.title}
            </Typography>
            <Typography variant="body2" color={colors.textSecondary}>
              {isTablet ? 'Complete the form below with touch-friendly inputs' : 'Fill out all required fields'}
            </Typography>
          </View>

          {/* Form Fields */}
          <Card style={styles.formCard} padding={isTablet ? 'lg' : 'md'}>
            {isTablet && isLandscape ? (
              <FlatList
                data={formConfig.fields}
                renderItem={renderFormField}
                numColumns={columns}
                keyExtractor={(item) => item.name}
                contentContainerStyle={styles.gridContainer}
                scrollEnabled={false}
              />
            ) : (
              <View style={styles.listContainer}>
                {formConfig.fields.map((field) => (
                  <View key={field.name} style={styles.fieldWrapper}>
                    <DynamicField field={field} />
                  </View>
                ))}
              </View>
            )}
          </Card>

          {/* Action Buttons */}
          <Card style={styles.actionsCard} padding={isTablet ? 'lg' : 'md'}>
            <View style={styles.buttonContainer}>
              <Button
                title={isSubmitting ? 'Submitting...' : 'Submit Form'}
                onPress={handleSubmit}
                disabled={isSubmitting}
                size={isTablet ? 'large' : 'medium'}
                fullWidth={!isTablet || !isLandscape}
                style={styles.submitButton}
              />
              
              {isTablet && isLandscape && <View style={styles.buttonSpacer} />}
              
              <Button
                title="Reset Form"
                onPress={handleReset}
                variant="outline"
                disabled={isSubmitting}
                size={isTablet ? 'large' : 'medium'}
                fullWidth={!isTablet || !isLandscape}
                style={styles.resetButton}
              />
            </View>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default function ResponsiveFormScreen() {
  return (
    <FormProvider>
      <ResponsiveFormContent />
    </FormProvider>
  );
}

const getStyles = (isTablet: boolean, isLandscape: boolean, getPadding: Function, getFontSize: Function, getSpacing: Function) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    keyboardAvoidingView: {
      flex: 1,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      padding: getPadding(),
      paddingBottom: getSpacing('xl'),
    },
    header: {
      marginBottom: getSpacing('lg'),
      alignItems: isTablet ? 'center' : 'flex-start',
    },
    title: {
      marginBottom: getSpacing('xs'),
      textAlign: isTablet ? 'center' : 'left',
    },
    formCard: {
      marginBottom: getSpacing('md'),
    },
    gridContainer: {
      gap: getSpacing('sm'),
    },
    listContainer: {
      gap: getSpacing('sm'),
    },
    fieldWrapper: {
      marginBottom: getSpacing('sm'),
    },
    actionsCard: {
      marginBottom: getSpacing('md'),
    },
    buttonContainer: {
      flexDirection: isTablet && isLandscape ? 'row' : 'column',
      gap: getSpacing('md'),
    },
    submitButton: {
      flex: isTablet && isLandscape ? 1 : 0,
    },
    resetButton: {
      flex: isTablet && isLandscape ? 1 : 0,
    },
    buttonSpacer: {
      width: getSpacing('md'),
    },
  });
};
