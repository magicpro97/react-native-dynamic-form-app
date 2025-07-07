import React from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView } from 'react-native';
import { FormField, FormFieldOption } from '../../types/form';
import { useForm } from '../../context/FormContext';
import { useResponsive } from '../../hooks/useResponsive';
import { colors, fontWeight } from '../../theme';
import { RiskIndicator, getFieldRiskLevel } from '../ui/RiskIndicator';
import { Button } from '../ui';

interface ResponsiveRadioFieldProps {
  field: FormField;
  error?: string;
}

export const ResponsiveRadioField: React.FC<ResponsiveRadioFieldProps> = ({
  field,
  error,
}) => {
  const { formState, setField } = useForm();
  const { isTablet, getFontSize, getSpacing, getColumns, isLandscape } =
    useResponsive();

  const value = formState[field.name] || '';
  const riskLevel = getFieldRiskLevel(field);
  const styles = getStyles(isTablet, getFontSize, getSpacing, isLandscape);
  const columns = getColumns();

  const renderRadioOption = ({ item }: { item: FormFieldOption }) => (
    <View style={[styles.radioOption, { flex: 1 / columns }]}>
      <Button
        title={`${item.value === value ? '●' : '○'} ${item.label}`}
        onPress={() => setField(field.name, item.value)}
        variant={item.value === value ? 'primary' : 'outline'}
        size={isTablet ? 'large' : 'medium'}
        fullWidth
        style={styles.radioButton}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.fieldContainer}>
        <View style={styles.labelContainer}>
          <Text style={styles.label}>
            {field.label}
            {field.required && <Text style={styles.required}> *</Text>}
          </Text>
          <RiskIndicator level={riskLevel} size='small' showLabel={false} />
        </View>

        <View style={styles.optionsContainer}>
          {isTablet && isLandscape ? (
            <FlatList
              data={field.options}
              renderItem={renderRadioOption}
              numColumns={columns}
              keyExtractor={item => item.value}
              contentContainerStyle={styles.gridContainer}
              scrollEnabled={false}
            />
          ) : (
            <ScrollView
              horizontal={false}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContainer}
            >
              {field.options?.map(option => (
                <View key={option.value} style={styles.radioOption}>
                  <Button
                    title={`${option.value === value ? '●' : '○'} ${option.label}`}
                    onPress={() => setField(field.name, option.value)}
                    variant={option.value === value ? 'primary' : 'outline'}
                    size={isTablet ? 'large' : 'medium'}
                    fullWidth
                    style={styles.radioButton}
                  />
                </View>
              ))}
            </ScrollView>
          )}
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>❌ {error}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const getStyles = (
  isTablet: boolean,
  getFontSize: (size: 'small' | 'medium' | 'large' | 'xlarge') => number,
  getSpacing: (size: 'xs' | 'sm' | 'md' | 'lg' | 'xl') => number,
  _isLandscape: boolean
) => {
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
      marginBottom: getSpacing('sm'),
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
    optionsContainer: {
      minHeight: isTablet ? 60 : 50,
    },
    gridContainer: {
      gap: getSpacing('xs'),
    },
    listContainer: {
      gap: getSpacing('xs'),
    },
    radioOption: {
      marginBottom: getSpacing('xs'),
    },
    radioButton: {
      marginBottom: 0,
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
