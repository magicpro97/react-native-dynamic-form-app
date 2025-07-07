import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { FormField } from '../../types/form';
import { useForm } from '../../context/FormContext';
import { useResponsive } from '../../hooks/useResponsive';
import { colors, borderRadius, fontWeight, shadows } from '../../theme';
import { RiskIndicator, getFieldRiskLevel } from '../ui/RiskIndicator';

interface ResponsiveTextInputProps {
  field: FormField;
  error?: string;
}

export const ResponsiveTextInput: React.FC<ResponsiveTextInputProps> = ({
  field,
  error,
}) => {
  const { formState, setField } = useForm();
  const { isTablet, getFontSize, getSpacing, isLandscape } = useResponsive();

  const rawValue = formState[field.name] || '';
  const value =
    typeof rawValue === 'string' ? rawValue : String(rawValue || '');
  const riskLevel = getFieldRiskLevel(field);

  const styles = getStyles(isTablet, getFontSize, getSpacing, isLandscape);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.fieldContainer}>
        <View style={styles.labelContainer}>
          <Text style={styles.label}>
            {field.label}
            {field.required && <Text style={styles.required}> *</Text>}
          </Text>
          <RiskIndicator level={riskLevel} size='small' showLabel={false} />
        </View>

        <TextInput
          style={[
            styles.input,
            error && styles.inputError,
            field.required && styles.inputRequired,
          ]}
          value={value}
          onChangeText={text => setField(field.name, text)}
          placeholder={field.placeholder}
          placeholderTextColor={colors.textSecondary}
          keyboardType={
            field.type === 'email'
              ? 'email-address'
              : field.type === 'number'
                ? 'numeric'
                : 'default'
          }
          autoCapitalize={field.type === 'email' ? 'none' : 'sentences'}
          autoCorrect={field.type !== 'email'}
          textContentType={field.type === 'email' ? 'emailAddress' : undefined}
          returnKeyType='next'
          blurOnSubmit={false}
        />

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>❌ {error}</Text>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

const getStyles = (
  isTablet: boolean,
  getFontSize: (size: 'small' | 'medium' | 'large' | 'xlarge') => number,
  getSpacing: (size: 'xs' | 'sm' | 'md' | 'lg' | 'xl') => number,
  isLandscape: boolean
) => {
  const inputHeight = isTablet ? (isLandscape ? 56 : 52) : 48;

  return StyleSheet.create({
    container: {
      flex: 1,
    },
    fieldContainer: {
      marginBottom: getSpacing('lg'),
      paddingBottom: getSpacing('sm'),
    },
    labelContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: getSpacing('xs'),
    },
    label: {
      fontSize: getFontSize('medium'),
      fontWeight: fontWeight.medium,
      color: colors.textPrimary,
    },
    required: {
      color: colors.error,
      fontSize: getFontSize('medium'),
      fontWeight: fontWeight.bold,
    },
    input: {
      height: inputHeight,
      paddingHorizontal: getSpacing('md'),
      paddingVertical: getSpacing('sm'),
      fontSize: getFontSize('medium'),
      backgroundColor: colors.surface,
      borderWidth: 2,
      borderColor: colors.border,
      borderRadius: borderRadius.md,
      color: colors.textPrimary,
      ...shadows.sm,
    },
    inputRequired: {
      borderLeftWidth: 4,
      borderLeftColor: colors.riskMedium,
    },
    inputError: {
      borderColor: colors.error,
      borderLeftColor: colors.error,
    },
    errorContainer: {
      marginTop: getSpacing('xs'),
      paddingHorizontal: getSpacing('xs'),
    },
    errorText: {
      fontSize: getFontSize('small'),
      color: colors.error,
      fontWeight: fontWeight.medium,
    },
  });
};
