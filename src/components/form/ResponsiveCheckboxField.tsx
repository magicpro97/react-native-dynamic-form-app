import React from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView } from 'react-native';
import { FormField } from '../../types/form';
import { useForm } from '../../context/FormContext';
import { useResponsive } from '../../hooks/useResponsive';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../../theme';
import { RiskIndicator, getFieldRiskLevel } from '../ui/RiskIndicator';
import { Button } from '../ui';

interface ResponsiveCheckboxFieldProps {
  field: FormField;
  error?: string;
}

export const ResponsiveCheckboxField: React.FC<ResponsiveCheckboxFieldProps> = ({ field, error }) => {
  const { formState, setField } = useForm();
  const { isTablet, getFontSize, getSpacing, getColumns, isLandscape } = useResponsive();
  
  // Handle both single checkbox (boolean) and multiple checkboxes (array)
  const isSingleCheckbox = !field.options || field.options.length === 0;
  const value: string[] | boolean = isSingleCheckbox 
    ? (formState[field.name] || false)
    : (formState[field.name] || []);
  
  const riskLevel = getFieldRiskLevel(field);
  const styles = getStyles(isTablet, getFontSize, getSpacing, isLandscape);
  const columns = getColumns();

  const toggleOption = (optionValue: string) => {
    const currentValue = formState[field.name] || [];
    const newValue = currentValue.includes(optionValue)
      ? currentValue.filter((v: string) => v !== optionValue)
      : [...currentValue, optionValue];
    setField(field.name, newValue);
  };

  const toggleSingleCheckbox = () => {
    setField(field.name, !formState[field.name]);
  };

  const renderCheckboxOption = ({ item, index }: { item: any; index: number }) => {
    const currentValue = formState[field.name] || [];
    const isSelected = currentValue.includes(item.value);
    return (
      <View style={[styles.checkboxOption, { flex: 1 / columns }]}>
        <Button
          title={`${isSelected ? '☑️' : '☐'} ${item.label}`}
          onPress={() => toggleOption(item.value)}
          variant={isSelected ? 'primary' : 'outline'}
          size={isTablet ? 'large' : 'medium'}
          fullWidth
          style={styles.checkboxButton}
        />
      </View>
    );
  };

  // If single checkbox, render differently
  if (isSingleCheckbox) {
    return (
      <View style={styles.container}>
        <View style={styles.fieldContainer}>
          <View style={styles.labelContainer}>
            <RiskIndicator level={riskLevel} size="small" showLabel={false} />
          </View>
          
          <View style={styles.optionsContainer}>
            <Button
              title={`${value ? '☑️' : '☐'} ${field.label}`}
              onPress={toggleSingleCheckbox}
              variant={value ? 'primary' : 'outline'}
              size={isTablet ? 'large' : 'medium'}
              fullWidth
              style={styles.checkboxButton}
            />
          </View>
          
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>❌ {error}</Text>
            </View>
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.fieldContainer}>
        <View style={styles.labelContainer}>
          <Text style={styles.label}>
            {field.label}
            {field.required && <Text style={styles.required}> *</Text>}
          </Text>
          <RiskIndicator level={riskLevel} size="small" showLabel={false} />
        </View>
        
        <Text style={styles.helperText}>
          Select multiple options {field.required ? '(at least one required)' : '(optional)'}
        </Text>
        
        <View style={styles.optionsContainer}>
          {isTablet && isLandscape ? (
            <FlatList
              data={field.options}
              renderItem={renderCheckboxOption}
              numColumns={columns}
              keyExtractor={(item) => item.value}
              contentContainerStyle={styles.gridContainer}
              scrollEnabled={false}
            />
          ) : (
            <ScrollView 
              horizontal={false}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContainer}
            >
              {field.options?.map((option, index) => {
                const currentValue = formState[field.name] || [];
                const isSelected = currentValue.includes(option.value);
                return (
                  <View key={option.value} style={styles.checkboxOption}>
                    <Button
                      title={`${isSelected ? '☑️' : '☐'} ${option.label}`}
                      onPress={() => toggleOption(option.value)}
                      variant={isSelected ? 'primary' : 'outline'}
                      size={isTablet ? 'large' : 'medium'}
                      fullWidth
                      style={styles.checkboxButton}
                    />
                  </View>
                );
              })}
            </ScrollView>
          )}
        </View>
        
        {Array.isArray(value) && value.length > 0 && (
          <Text style={styles.selectedText}>
            Selected: {value.length} item{value.length > 1 ? 's' : ''}
          </Text>
        )}
        
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>❌ {error}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const getStyles = (isTablet: boolean, getFontSize: Function, getSpacing: Function, isLandscape: boolean) => {
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
    helperText: {
      fontSize: getFontSize('small'),
      color: colors.textSecondary,
      marginBottom: getSpacing('sm'),
      fontStyle: 'italic',
    },
    optionsContainer: {
      minHeight: isTablet ? 60 : 50,
    },
    gridContainer: {
      gap: getSpacing('xs'),
    },
    listContainer: {
      gap: getSpacing('xs'),
    },
    checkboxOption: {
      marginBottom: getSpacing('xs'),
    },
    checkboxButton: {
      marginBottom: 0,
    },
    selectedText: {
      fontSize: getFontSize('small'),
      color: colors.primary,
      fontWeight: fontWeight.medium,
      marginTop: getSpacing('xs'),
      textAlign: 'center',
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
