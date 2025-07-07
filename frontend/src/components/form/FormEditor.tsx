import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Switch,
} from 'react-native';
import { colors, fontWeight } from '../../theme';
import { useResponsive } from '../../hooks/useResponsive';
import { FormConfiguration } from '../../services/api';
import { FormField } from '../../types/form';
import { ValidationRule, validators } from '../../utils/validation';
import { Button } from '../ui';

// Enhanced FormField interface with validation
interface EnhancedFormField extends FormField {
  validation?: ValidationRule[];
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  customMessage?: string;
}

interface FormEditorProps {
  form: FormConfiguration;
  onSave: (formData: Partial<FormConfiguration>) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const FIELD_TYPES: FormField['type'][] = [
  'text',
  'email',
  'number',
  'password',
  'radio',
  'checkbox',
  'select',
  'signature',
  'photo',
];

const VALIDATION_TYPES = [
  { type: 'required', label: 'Required' },
  { type: 'email', label: 'Email Format' },
  { type: 'phone', label: 'Phone Number' },
  { type: 'minLength', label: 'Minimum Length' },
  { type: 'maxLength', label: 'Maximum Length' },
  { type: 'pattern', label: 'Custom Pattern' },
  { type: 'positiveNumber', label: 'Positive Number' },
  { type: 'currency', label: 'Currency Format' },
  { type: 'date', label: 'Valid Date' },
  { type: 'futureDate', label: 'Future Date' },
  { type: 'pastDate', label: 'Past Date' },
] as const;

export const FormEditor: React.FC<FormEditorProps> = ({
  form,
  onSave,
  onCancel,
  loading = false,
}) => {
  const { isTablet, getFontSize, getSpacing } = useResponsive();
  const [formData, setFormData] = useState<Partial<FormConfiguration>>({});
  const [editingFieldIndex, setEditingFieldIndex] = useState<number | null>(
    null
  );
  const [showValidationPanel, setShowValidationPanel] = useState<number | null>(
    null
  );
  const [testResults, setTestResults] = useState<{
    [key: string]: { isValid: boolean; message: string };
  }>({});

  const styles = getStyles(isTablet, getFontSize, getSpacing);

  useEffect(() => {
    setFormData({
      name: form.name,
      title: form.title,
      description: form.description,
      version: form.version,
      fields: [...form.fields],
      settings: { ...form.settings },
    });
  }, [form]);

  const handleSave = async () => {
    if (!formData.name?.trim()) {
      Alert.alert('Error', 'Form name is required');
      return;
    }
    if (!formData.title?.trim()) {
      Alert.alert('Error', 'Form title is required');
      return;
    }
    if (!formData.fields || formData.fields.length === 0) {
      Alert.alert('Error', 'At least one field is required');
      return;
    }

    try {
      await onSave(formData);
    } catch {
      Alert.alert('Error', 'Failed to save form');
    }
  };

  const renderInputField = (
    label: string,
    value: string,
    onChangeText: (text: string) => void,
    placeholder?: string,
    multiline = false,
    required = false
  ) => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>
        {label}
        {required && <Text style={styles.requiredIndicator}> *</Text>}
      </Text>
      <TextInput
        style={[styles.textInput, multiline && styles.multilineInput]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        multiline={multiline}
        numberOfLines={multiline ? 3 : 1}
      />
    </View>
  );

  const handleFieldChange = (
    index: number,
    field: Partial<EnhancedFormField>
  ) => {
    const updatedFields = [...(formData.fields || [])];
    updatedFields[index] = { ...updatedFields[index], ...field };
    setFormData({ ...formData, fields: updatedFields });
  };

  const handleValidationChange = (
    fieldIndex: number,
    validationType: string,
    enabled: boolean,
    value?: string | number
  ) => {
    const updatedFields = [...(formData.fields || [])] as EnhancedFormField[];
    const field = updatedFields[fieldIndex];

    if (!field.validation) {
      field.validation = [];
    }

    const existingIndex = field.validation.findIndex(
      rule => rule.type === validationType
    );

    if (enabled) {
      const newRule: ValidationRule = {
        type: validationType as ValidationRule['type'],
        message: getDefaultValidationMessage(validationType, value),
        value,
      };

      if (existingIndex >= 0) {
        field.validation[existingIndex] = newRule;
      } else {
        field.validation.push(newRule);
      }
    } else {
      if (existingIndex >= 0) {
        field.validation.splice(existingIndex, 1);
      }
    }

    setFormData({ ...formData, fields: updatedFields });
  };

  const getDefaultValidationMessage = (
    type: string,
    value?: string | number
  ): string => {
    const messages: { [key: string]: string } = {
      required: 'This field is required',
      email: 'Please enter a valid email address',
      phone: 'Please enter a valid phone number',
      minLength: `Must be at least ${value || 1} characters`,
      maxLength: `Must be no more than ${value || 100} characters`,
      pattern: 'Invalid format',
      positiveNumber: 'Must be a positive number',
      currency: 'Please enter a valid currency amount',
      date: 'Please enter a valid date',
      futureDate: 'Date must be in the future',
      pastDate: 'Date must be in the past',
    };
    return messages[type] || 'Invalid value';
  };

  const isValidationEnabled = (
    fieldIndex: number,
    validationType: string
  ): boolean => {
    const field = formData.fields?.[fieldIndex] as EnhancedFormField;
    return (
      field?.validation?.some(rule => rule.type === validationType) || false
    );
  };

  const testValidationRule = (
    type: string,
    value: string,
    ruleValue?: unknown
  ): { isValid: boolean; message: string } => {
    try {
      let isValid = false;
      let message = '';

      switch (type) {
        case 'required':
          isValid = validators.required(value);
          message = isValid
            ? '✅ Valid: Field has value'
            : '❌ Invalid: Field is required';
          break;
        case 'email':
          isValid = validators.email(value);
          message = isValid
            ? '✅ Valid: Email format is correct'
            : '❌ Invalid: Not a valid email format';
          break;
        case 'phone':
          isValid = validators.phone(value);
          message = isValid
            ? '✅ Valid: Phone number format is correct'
            : '❌ Invalid: Not a valid phone number';
          break;
        case 'minLength':
          isValid = validators.minLength(
            value,
            typeof ruleValue === 'number' ? ruleValue : 1
          );
          message = isValid
            ? `✅ Valid: Length ${value.length} >= ${typeof ruleValue === 'number' ? ruleValue : 1}`
            : `❌ Invalid: Length ${value.length} < ${typeof ruleValue === 'number' ? ruleValue : 1}`;
          break;
        case 'maxLength':
          isValid = validators.maxLength(
            value,
            typeof ruleValue === 'number' ? ruleValue : 100
          );
          message = isValid
            ? `✅ Valid: Length ${value.length} <= ${typeof ruleValue === 'number' ? ruleValue : 100}`
            : `❌ Invalid: Length ${value.length} > ${typeof ruleValue === 'number' ? ruleValue : 100}`;
          break;
        case 'pattern':
          try {
            isValid = validators.pattern(
              value,
              new RegExp(typeof ruleValue === 'string' ? ruleValue : '.*')
            );
            message = isValid
              ? '✅ Valid: Pattern matches'
              : '❌ Invalid: Pattern does not match';
          } catch {
            message = '❌ Invalid: Invalid regex pattern';
          }
          break;
        case 'positiveNumber':
          isValid = validators.positiveNumber(value);
          message = isValid
            ? '✅ Valid: Is a positive number'
            : '❌ Invalid: Not a positive number';
          break;
        case 'currency':
          isValid = validators.currency(value);
          message = isValid
            ? '✅ Valid: Currency format is correct'
            : '❌ Invalid: Not a valid currency format';
          break;
        case 'date':
          isValid = validators.date(value);
          message = isValid
            ? '✅ Valid: Is a valid date'
            : '❌ Invalid: Not a valid date';
          break;
        case 'futureDate':
          isValid = validators.futureDate(value);
          message = isValid
            ? '✅ Valid: Date is in the future'
            : '❌ Invalid: Date is not in the future';
          break;
        case 'pastDate':
          isValid = validators.pastDate(value);
          message = isValid
            ? '✅ Valid: Date is in the past'
            : '❌ Invalid: Date is not in the past';
          break;
        default:
          isValid = true;
          message = '⚠️ Unknown validation type';
      }

      return { isValid, message };
    } catch {
      return { isValid: false, message: '❌ Error: Validation failed' };
    }
  };

  const handleTestValidation = (
    fieldIndex: number,
    validationType: string,
    testValue: string,
    ruleValue?: unknown
  ) => {
    const testKey = `${fieldIndex}-${validationType}`;
    const result = testValidationRule(validationType, testValue, ruleValue);
    setTestResults(prev => ({
      ...prev,
      [testKey]: result,
    }));
  };

  const getTestExamples = (validationType: string, _ruleValue?: unknown) => {
    const examples: { [key: string]: string[] } = {
      required: ['', 'hello', ' '],
      email: ['test@example.com', 'invalid-email', 'user@domain'],
      phone: ['+1234567890', '123-456-7890', 'not-a-phone'],
      minLength: ['short', 'this is long enough', 'a'],
      maxLength: ['ok', 'this text is way too long for the limit', 'short'],
      pattern: ['valid123', 'invalid@#$', 'test_user'],
      positiveNumber: ['42', '-5', '0', '3.14'],
      currency: ['19.99', '100', 'not-money', '45.678'],
      date: ['2023-12-25', '2023/12/25', 'not-a-date'],
      futureDate: ['2030-01-01', '2020-01-01', '2025-06-15'],
      pastDate: ['2020-01-01', '2030-01-01', '2022-03-15'],
    };
    return examples[validationType] || ['test', 'example', 'sample'];
  };

  const runQuickTest = (
    fieldIndex: number,
    validationType: string,
    ruleValue?: unknown
  ) => {
    const examples = getTestExamples(validationType, ruleValue);
    const results: string[] = [];

    examples.forEach(example => {
      const result = testValidationRule(validationType, example, ruleValue);
      const status = result.isValid ? '✅' : '❌';
      results.push(`${status} "${example}": ${result.message}`);
    });

    Alert.alert(`Quick Test: ${validationType}`, results.join('\n\n'), [
      { text: 'OK', style: 'default' },
    ]);
  };

  const getTestResult = (fieldIndex: number, validationType: string) => {
    const testKey = `${fieldIndex}-${validationType}`;
    return testResults[testKey];
  };

  const getValidationValue = (
    fieldIndex: number,
    validationType: string
  ): unknown => {
    const field = formData.fields?.[fieldIndex] as EnhancedFormField;
    const rule = field?.validation?.find(rule => rule.type === validationType);
    return rule?.value;
  };

  const handleAddField = () => {
    const newField: EnhancedFormField = {
      name: `field_${Date.now()}`,
      type: 'text',
      label: 'New Field',
      required: false,
      placeholder: '',
      validation: [],
    };
    setFormData({
      ...formData,
      fields: [...(formData.fields || []), newField],
    });
    setEditingFieldIndex(formData.fields?.length || 0);
  };

  const handleRemoveField = (index: number) => {
    Alert.alert('Remove Field', 'Are you sure you want to remove this field?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => {
          const updatedFields = [...(formData.fields || [])];
          updatedFields.splice(index, 1);
          setFormData({ ...formData, fields: updatedFields });
          if (editingFieldIndex === index) {
            setEditingFieldIndex(null);
          }
        },
      },
    ]);
  };

  const renderValidationSummary = (field: EnhancedFormField) => {
    if (!field.validation || field.validation.length === 0) {
      return <Text style={styles.validationSummary}>No validation rules</Text>;
    }

    return (
      <View style={styles.validationSummaryContainer}>
        <Text style={styles.validationSummaryTitle}>Validation Rules:</Text>
        {field.validation.map((rule, index) => (
          <Text key={index} style={styles.validationSummaryRule}>
            • {rule.message}
          </Text>
        ))}
      </View>
    );
  };

  const renderFieldEditor = (field: EnhancedFormField, index: number) => {
    const isEditing = editingFieldIndex === index;

    return (
      <View key={index} style={styles.fieldEditor}>
        <View style={styles.fieldHeader}>
          <Text style={styles.fieldTitle}>
            {index + 1}. {field.label}
          </Text>
          <View style={styles.fieldActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => setEditingFieldIndex(isEditing ? null : index)}
            >
              <Text style={styles.actionButtonText}>
                {isEditing ? 'Done' : 'Edit'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.removeButton]}
              onPress={() => handleRemoveField(index)}
            >
              <Text style={[styles.actionButtonText, styles.removeButtonText]}>
                Remove
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Show validation summary when not editing */}
        {!isEditing && renderValidationSummary(field)}

        {isEditing && (
          <View style={styles.fieldEditForm}>
            {renderInputField(
              'Field Name',
              field.name,
              (text: string) => handleFieldChange(index, { name: text }),
              'Enter field name',
              false,
              true
            )}
            {renderInputField(
              'Field Label',
              field.label,
              (text: string) => handleFieldChange(index, { label: text }),
              'Enter field label',
              false,
              true
            )}
            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Field Type</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.typeSelector}>
                  {FIELD_TYPES.map(type => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.typeButton,
                        field.type === type && styles.typeButtonSelected,
                      ]}
                      onPress={() => handleFieldChange(index, { type })}
                    >
                      <Text
                        style={[
                          styles.typeButtonText,
                          field.type === type && styles.typeButtonTextSelected,
                        ]}
                      >
                        {type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
            {renderInputField(
              'Placeholder',
              field.placeholder || '',
              (text: string) => handleFieldChange(index, { placeholder: text }),
              'Enter placeholder text'
            )}
            <View style={styles.checkboxRow}>
              <TouchableOpacity
                style={styles.checkbox}
                onPress={() =>
                  handleFieldChange(index, { required: !field.required })
                }
              >
                <View
                  style={[
                    styles.checkboxBox,
                    field.required && styles.checkboxBoxChecked,
                  ]}
                >
                  {field.required && (
                    <Text style={styles.checkboxCheck}>✓</Text>
                  )}
                </View>
                <Text style={styles.checkboxLabel}>Required field</Text>
              </TouchableOpacity>
            </View>

            {/* Validation Panel */}
            <View style={styles.validationSection}>
              <TouchableOpacity
                style={styles.validationHeader}
                onPress={() =>
                  setShowValidationPanel(
                    showValidationPanel === index ? null : index
                  )
                }
              >
                <Text style={styles.validationTitle}>
                  Field Validation Rules
                </Text>
                <Text style={styles.validationToggle}>
                  {showValidationPanel === index ? '▲' : '▼'}
                </Text>
              </TouchableOpacity>

              {showValidationPanel === index && (
                <View style={styles.validationPanel}>
                  {VALIDATION_TYPES.map(validation => {
                    const isEnabled = isValidationEnabled(
                      index,
                      validation.type
                    );
                    const currentValue = getValidationValue(
                      index,
                      validation.type
                    );

                    return (
                      <View key={validation.type} style={styles.validationRule}>
                        <View style={styles.validationRuleHeader}>
                          <Switch
                            value={isEnabled}
                            onValueChange={enabled =>
                              handleValidationChange(
                                index,
                                validation.type,
                                enabled
                              )
                            }
                            thumbColor={
                              isEnabled ? colors.primary : colors.textSecondary
                            }
                            trackColor={{
                              false: colors.border,
                              true: colors.primaryLight,
                            }}
                          />
                          <Text style={styles.validationRuleLabel}>
                            {validation.label}
                          </Text>
                        </View>

                        {isEnabled &&
                          (validation.type === 'minLength' ||
                            validation.type === 'maxLength') && (
                            <TextInput
                              style={styles.validationInput}
                              placeholder={`Enter ${validation.type === 'minLength' ? 'minimum' : 'maximum'} length`}
                              value={currentValue?.toString() || ''}
                              onChangeText={text => {
                                const numValue = parseInt(text) || 0;
                                handleValidationChange(
                                  index,
                                  validation.type,
                                  true,
                                  numValue
                                );
                              }}
                              keyboardType='numeric'
                            />
                          )}

                        {isEnabled && validation.type === 'pattern' && (
                          <TextInput
                            style={styles.validationInput}
                            placeholder='Enter regex pattern'
                            value={
                              typeof currentValue === 'string'
                                ? currentValue
                                : ''
                            }
                            onChangeText={text => {
                              handleValidationChange(
                                index,
                                validation.type,
                                true,
                                text
                              );
                            }}
                          />
                        )}

                        {/* Test validation input */}
                        {isEnabled && (
                          <View style={styles.validationTestContainer}>
                            <View style={styles.validationTestHeader}>
                              <Text style={styles.validationTestLabel}>
                                Test this rule:
                              </Text>
                              <View style={styles.validationTestActions}>
                                <TouchableOpacity
                                  style={styles.quickTestButton}
                                  onPress={() =>
                                    runQuickTest(
                                      index,
                                      validation.type,
                                      currentValue
                                    )
                                  }
                                >
                                  <Text style={styles.quickTestButtonText}>
                                    Quick Test
                                  </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                  style={styles.clearTestButton}
                                  onPress={() => {
                                    const testKey = `${index}-${validation.type}`;
                                    setTestResults(prev => {
                                      const newResults = { ...prev };
                                      delete newResults[testKey];
                                      return newResults;
                                    });
                                  }}
                                >
                                  <Text style={styles.clearTestButtonText}>
                                    Clear
                                  </Text>
                                </TouchableOpacity>
                              </View>
                            </View>
                            <TextInput
                              style={styles.validationTestInput}
                              placeholder={`Enter test value for ${validation.label.toLowerCase()}`}
                              onChangeText={testValue => {
                                if (testValue.length > 0) {
                                  handleTestValidation(
                                    index,
                                    validation.type,
                                    testValue,
                                    currentValue
                                  );
                                } else {
                                  // Clear result when input is empty
                                  const testKey = `${index}-${validation.type}`;
                                  setTestResults(prev => {
                                    const newResults = { ...prev };
                                    delete newResults[testKey];
                                    return newResults;
                                  });
                                }
                              }}
                            />
                            {/* Show test result */}
                            {(() => {
                              const testResult = getTestResult(
                                index,
                                validation.type
                              );
                              if (testResult) {
                                return (
                                  <View
                                    style={[
                                      styles.validationTestResult,
                                      testResult.isValid
                                        ? styles.validationTestResultValid
                                        : styles.validationTestResultInvalid,
                                    ]}
                                  >
                                    <Text
                                      style={[
                                        styles.validationTestResultText,
                                        testResult.isValid
                                          ? styles.validationTestResultTextValid
                                          : styles.validationTestResultTextInvalid,
                                      ]}
                                    >
                                      {testResult.message}
                                    </Text>
                                  </View>
                                );
                              }
                              return null;
                            })()}
                          </View>
                        )}
                      </View>
                    );
                  })}
                </View>
              )}
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Edit Form Configuration</Text>
        <View style={styles.headerActions}>
          <Button
            title='Cancel'
            onPress={onCancel}
            variant='outline'
            size='small'
            style={styles.headerButton}
          />
          <Button
            title='Save'
            onPress={handleSave}
            loading={loading}
            size='small'
            style={styles.headerButton}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Form Information</Text>
        {renderInputField(
          'Form Name',
          formData.name || '',
          (text: string) => setFormData({ ...formData, name: text }),
          'Enter form name',
          false,
          true
        )}
        {renderInputField(
          'Form Title',
          formData.title || '',
          (text: string) => setFormData({ ...formData, title: text }),
          'Enter form title',
          false,
          true
        )}
        {renderInputField(
          'Description',
          formData.description || '',
          (text: string) => setFormData({ ...formData, description: text }),
          'Enter form description',
          true
        )}
        {renderInputField(
          'Version',
          formData.version || '',
          (text: string) => setFormData({ ...formData, version: text }),
          'Enter version (e.g., 1.0.0)',
          false,
          true
        )}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Form Fields ({formData.fields?.length || 0})
          </Text>
          <Button
            title='Add Field'
            onPress={handleAddField}
            variant='outline'
            size='small'
          />
        </View>
        {formData.fields?.map((field, index) =>
          renderFieldEditor(field, index)
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        <View style={styles.checkboxRow}>
          <TouchableOpacity
            style={styles.checkbox}
            onPress={() =>
              setFormData({
                ...formData,
                settings: {
                  ...formData.settings,
                  allowOffline: !formData.settings?.allowOffline,
                },
              })
            }
          >
            <View
              style={[
                styles.checkboxBox,
                formData.settings?.allowOffline && styles.checkboxBoxChecked,
              ]}
            >
              {formData.settings?.allowOffline && (
                <Text style={styles.checkboxCheck}>✓</Text>
              )}
            </View>
            <Text style={styles.checkboxLabel}>Allow Offline</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.checkboxRow}>
          <TouchableOpacity
            style={styles.checkbox}
            onPress={() =>
              setFormData({
                ...formData,
                settings: {
                  ...formData.settings,
                  requireAuth: !formData.settings?.requireAuth,
                },
              })
            }
          >
            <View
              style={[
                styles.checkboxBox,
                formData.settings?.requireAuth && styles.checkboxBoxChecked,
              ]}
            >
              {formData.settings?.requireAuth && (
                <Text style={styles.checkboxCheck}>✓</Text>
              )}
            </View>
            <Text style={styles.checkboxLabel}>Require Authentication</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Form Validation Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Form Validation Summary</Text>
        <View style={styles.validationOverview}>
          <Text style={styles.validationOverviewText}>
            Total Fields: {formData.fields?.length || 0}
          </Text>
          <Text style={styles.validationOverviewText}>
            Required Fields:{' '}
            {formData.fields?.filter(f => f.required).length || 0}
          </Text>
          <Text style={styles.validationOverviewText}>
            Fields with Validation:{' '}
            {formData.fields?.filter(
              f => (f as EnhancedFormField).validation?.length
            ).length || 0}
          </Text>
        </View>

        {formData.fields?.some(
          f => (f as EnhancedFormField).validation?.length
        ) && (
          <View style={styles.validationPreview}>
            <Text style={styles.validationPreviewTitle}>
              Validation Rules Overview:
            </Text>
            {formData.fields?.map((field, fieldIndex) => {
              const enhancedField = field as EnhancedFormField;
              if (!enhancedField.validation?.length) return null;

              return (
                <View key={fieldIndex} style={styles.validationPreviewField}>
                  <Text style={styles.validationPreviewFieldName}>
                    {field.label}:
                  </Text>
                  {enhancedField.validation.map((rule, ruleIndex) => (
                    <Text key={ruleIndex} style={styles.validationPreviewRule}>
                      • {rule.message}
                    </Text>
                  ))}
                </View>
              );
            })}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const getStyles = (
  isTablet: boolean,
  getFontSize: (size: 'small' | 'medium' | 'large' | 'xlarge') => number,
  getSpacing: (size: 'xs' | 'sm' | 'md' | 'lg' | 'xl') => number
) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: getSpacing('md'),
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerTitle: {
      fontSize: getFontSize('large'),
      fontWeight: fontWeight.bold,
      color: colors.textPrimary,
    },
    headerActions: {
      flexDirection: 'row',
    },
    headerButton: {
      marginLeft: getSpacing('sm'),
    },
    section: {
      padding: getSpacing('md'),
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: getSpacing('md'),
    },
    sectionTitle: {
      fontSize: getFontSize('large'),
      fontWeight: fontWeight.bold,
      color: colors.textPrimary,
      marginBottom: getSpacing('md'),
    },
    fieldEditor: {
      backgroundColor: colors.surface,
      borderRadius: 8,
      padding: getSpacing('md'),
      marginBottom: getSpacing('md'),
      borderWidth: 1,
      borderColor: colors.border,
    },
    fieldHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: getSpacing('sm'),
    },
    fieldTitle: {
      fontSize: getFontSize('medium'),
      fontWeight: fontWeight.medium,
      color: colors.textPrimary,
      flex: 1,
    },
    fieldActions: {
      flexDirection: 'row',
    },
    actionButton: {
      paddingHorizontal: getSpacing('sm'),
      paddingVertical: getSpacing('xs'),
      backgroundColor: colors.primary,
      borderRadius: 4,
      marginLeft: getSpacing('xs'),
    },
    actionButtonText: {
      color: colors.surface,
      fontSize: getFontSize('small'),
      fontWeight: fontWeight.medium,
    },
    removeButton: {
      backgroundColor: colors.error,
    },
    removeButtonText: {
      color: colors.surface,
    },
    fieldEditForm: {
      marginTop: getSpacing('md'),
    },
    fieldRow: {
      marginBottom: getSpacing('md'),
    },
    fieldLabel: {
      fontSize: getFontSize('medium'),
      fontWeight: fontWeight.medium,
      color: colors.textPrimary,
      marginBottom: getSpacing('sm'),
    },
    typeSelector: {
      flexDirection: 'row',
      paddingVertical: getSpacing('sm'),
    },
    typeButton: {
      paddingHorizontal: getSpacing('sm'),
      paddingVertical: getSpacing('xs'),
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 4,
      marginRight: getSpacing('xs'),
    },
    typeButtonSelected: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    typeButtonText: {
      fontSize: getFontSize('small'),
      color: colors.textPrimary,
    },
    typeButtonTextSelected: {
      color: colors.surface,
    },
    checkboxRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: getSpacing('md'),
    },
    checkbox: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    checkboxBox: {
      width: 20,
      height: 20,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 3,
      marginRight: getSpacing('sm'),
      justifyContent: 'center',
      alignItems: 'center',
    },
    checkboxBoxChecked: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    checkboxCheck: {
      color: colors.surface,
      fontSize: getFontSize('small'),
      fontWeight: fontWeight.bold,
    },
    checkboxLabel: {
      fontSize: getFontSize('medium'),
      color: colors.textPrimary,
    },
    inputContainer: {
      marginBottom: getSpacing('md'),
    },
    inputLabel: {
      fontSize: getFontSize('medium'),
      fontWeight: fontWeight.medium,
      color: colors.textPrimary,
      marginBottom: getSpacing('sm'),
    },
    requiredIndicator: {
      color: colors.error,
      fontWeight: fontWeight.bold,
    },
    textInput: {
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      padding: getSpacing('sm'),
      fontSize: getFontSize('medium'),
      color: colors.textPrimary,
      minHeight: 44,
    },
    multilineInput: {
      minHeight: 88,
      textAlignVertical: 'top',
    },
    validationSection: {
      marginTop: getSpacing('md'),
      borderTopWidth: 1,
      borderTopColor: colors.border,
      paddingTop: getSpacing('md'),
    },
    validationHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: getSpacing('sm'),
      backgroundColor: colors.background,
      borderRadius: 6,
      paddingHorizontal: getSpacing('sm'),
    },
    validationTitle: {
      fontSize: getFontSize('medium'),
      fontWeight: fontWeight.medium,
      color: colors.textPrimary,
    },
    validationToggle: {
      fontSize: getFontSize('medium'),
      color: colors.textSecondary,
    },
    validationPanel: {
      marginTop: getSpacing('sm'),
      backgroundColor: colors.background,
      borderRadius: 6,
      padding: getSpacing('sm'),
    },
    validationRule: {
      marginBottom: getSpacing('sm'),
      paddingBottom: getSpacing('sm'),
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    validationRuleHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: getSpacing('xs'),
    },
    validationRuleLabel: {
      fontSize: getFontSize('medium'),
      color: colors.textPrimary,
      marginLeft: getSpacing('sm'),
      flex: 1,
    },
    validationInput: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 4,
      padding: getSpacing('xs'),
      fontSize: getFontSize('small'),
      color: colors.textPrimary,
      marginTop: getSpacing('xs'),
    },
    validationSummary: {
      fontSize: getFontSize('small'),
      color: colors.textSecondary,
      fontStyle: 'italic',
      marginTop: getSpacing('xs'),
    },
    validationSummaryContainer: {
      backgroundColor: colors.background,
      borderRadius: 4,
      padding: getSpacing('xs'),
      marginTop: getSpacing('xs'),
    },
    validationSummaryTitle: {
      fontSize: getFontSize('small'),
      fontWeight: fontWeight.medium,
      color: colors.textPrimary,
      marginBottom: getSpacing('xs'),
    },
    validationSummaryRule: {
      fontSize: getFontSize('small'),
      color: colors.textSecondary,
      marginBottom: 2,
    },
    validationTestContainer: {
      backgroundColor: colors.background,
      borderRadius: 4,
      padding: getSpacing('xs'),
      marginTop: getSpacing('xs'),
      borderWidth: 1,
      borderColor: colors.border,
    },
    validationTestLabel: {
      fontSize: getFontSize('small'),
      fontWeight: fontWeight.medium,
      color: colors.textPrimary,
      marginBottom: getSpacing('xs'),
    },
    validationTestInput: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 4,
      padding: getSpacing('xs'),
      fontSize: getFontSize('small'),
      color: colors.textPrimary,
    },
    validationTestHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: getSpacing('xs'),
    },
    clearTestButton: {
      paddingHorizontal: getSpacing('xs'),
      paddingVertical: 2,
      backgroundColor: colors.textSecondary,
      borderRadius: 3,
    },
    clearTestButtonText: {
      fontSize: getFontSize('small'),
      color: colors.surface,
      fontWeight: fontWeight.medium,
    },
    validationOverview: {
      backgroundColor: colors.surface,
      borderRadius: 6,
      padding: getSpacing('md'),
      marginBottom: getSpacing('md'),
    },
    validationOverviewText: {
      fontSize: getFontSize('medium'),
      color: colors.textPrimary,
      marginBottom: getSpacing('xs'),
    },
    validationPreview: {
      backgroundColor: colors.background,
      borderRadius: 6,
      padding: getSpacing('md'),
    },
    validationPreviewTitle: {
      fontSize: getFontSize('medium'),
      fontWeight: fontWeight.bold,
      color: colors.textPrimary,
      marginBottom: getSpacing('md'),
    },
    validationPreviewField: {
      marginBottom: getSpacing('md'),
      paddingBottom: getSpacing('sm'),
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    validationPreviewFieldName: {
      fontSize: getFontSize('medium'),
      fontWeight: fontWeight.medium,
      color: colors.textPrimary,
      marginBottom: getSpacing('xs'),
    },
    validationPreviewRule: {
      fontSize: getFontSize('small'),
      color: colors.textSecondary,
      marginLeft: getSpacing('sm'),
      marginBottom: 2,
    },
    validationTestResult: {
      marginTop: getSpacing('xs'),
      padding: getSpacing('xs'),
      borderRadius: 4,
      borderWidth: 1,
    },
    validationTestResultValid: {
      backgroundColor: '#f0f9ff', // Light green background
      borderColor: '#22c55e', // Green border
    },
    validationTestResultInvalid: {
      backgroundColor: '#fef2f2', // Light red background
      borderColor: '#ef4444', // Red border
    },
    validationTestResultText: {
      fontSize: getFontSize('small'),
      fontWeight: fontWeight.medium,
    },
    validationTestResultTextValid: {
      color: '#15803d', // Dark green text
    },
    validationTestResultTextInvalid: {
      color: '#dc2626', // Dark red text
    },
    validationTestActions: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    quickTestButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: getSpacing('xs'),
      paddingVertical: 4,
      borderRadius: 4,
      marginRight: getSpacing('xs'),
    },
    quickTestButtonText: {
      fontSize: getFontSize('small'),
      color: colors.white,
      fontWeight: fontWeight.medium,
    },
  });
};
