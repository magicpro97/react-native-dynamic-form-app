import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { colors, spacing, fontSize, fontWeight } from '../theme';
import { useResponsive } from '../hooks/useResponsive';
import {
  useFormConfigurations,
  useFormConfiguration,
  useFormConfigurationActions,
  useFormConfigurationSearch,
} from '../hooks/useFormConfiguration';
import { FormConfiguration } from '../services/api';
import { Button } from '../components/ui';
import { ResponsiveTextInput } from '../components/form/ResponsiveTextInput';

export const FormConfigurationScreen: React.FC = () => {
  const { isTablet, getFontSize, getSpacing } = useResponsive();
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  // Hooks for API operations
  const {
    data: formsList,
    loading: listLoading,
    error: listError,
    refetch: refetchList,
  } = useFormConfigurations(1, 20);

  const {
    data: selectedForm,
    loading: formLoading,
    error: formError,
  } = useFormConfiguration(selectedFormId);

  const {
    createForm,
    updateForm,
    deleteForm,
    loading: actionLoading,
  } = useFormConfigurationActions();

  const {
    results: searchResults,
    loading: searchLoading,
    search,
    clearResults,
  } = useFormConfigurationSearch();

  const styles = getStyles(isTablet, getFontSize, getSpacing);

  const handleSelectForm = (formId: string) => {
    setSelectedFormId(formId);
  };

  const handleDeleteForm = async (formId: string) => {
    Alert.alert(
      'Delete Form',
      'Are you sure you want to delete this form configuration?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const result = await deleteForm(formId);
            if (result.success) {
              Alert.alert('Success', 'Form deleted successfully');
              refetchList();
              if (selectedFormId === formId) {
                setSelectedFormId(null);
              }
            }
          },
        },
      ]
    );
  };

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      await search(searchQuery);
    } else {
      clearResults();
    }
  };

  const renderFormItem = (form: FormConfiguration) => (
    <TouchableOpacity
      key={form.id}
      style={[
        styles.formItem,
        selectedFormId === form.id && styles.selectedFormItem,
      ]}
      onPress={() => handleSelectForm(form.id)}
    >
      <View style={styles.formItemHeader}>
        <Text style={styles.formTitle}>{form.title}</Text>
        <Text style={styles.formVersion}>v{form.version}</Text>
      </View>
      <Text style={styles.formDescription}>{form.description}</Text>
      <Text style={styles.formFields}>
        {form.fields.length} field{form.fields.length !== 1 ? 's' : ''}
      </Text>
      <View style={styles.formActions}>
        <Button
          title='Edit'
          onPress={() => {
            // TODO: Navigate to edit screen
            Alert.alert('Edit', `Edit form: ${form.title}`);
          }}
          variant='outline'
          size='small'
          style={styles.actionButton}
        />
        <Button
          title='Delete'
          onPress={() => handleDeleteForm(form.id)}
          variant='outline'
          size='small'
          style={StyleSheet.flatten([
            styles.actionButton,
            { borderColor: colors.error },
          ])}
        />
      </View>
    </TouchableOpacity>
  );

  const renderFormDetails = () => {
    if (formLoading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size='large' color={colors.primary} />
          <Text style={styles.loadingText}>Loading form details...</Text>
        </View>
      );
    }

    if (formError) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Error: {formError}</Text>
        </View>
      );
    }

    if (!selectedForm) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.placeholderText}>
            Select a form to view details
          </Text>
        </View>
      );
    }

    return (
      <ScrollView style={styles.formDetails}>
        <Text style={styles.detailTitle}>{selectedForm.title}</Text>
        <Text style={styles.detailDescription}>{selectedForm.description}</Text>

        <View style={styles.detailSection}>
          <Text style={styles.sectionTitle}>Form Information</Text>
          <Text style={styles.detailText}>Name: {selectedForm.name}</Text>
          <Text style={styles.detailText}>Version: {selectedForm.version}</Text>
          <Text style={styles.detailText}>
            Created: {new Date(selectedForm.createdAt).toLocaleDateString()}
          </Text>
          <Text style={styles.detailText}>
            Updated: {new Date(selectedForm.updatedAt).toLocaleDateString()}
          </Text>
        </View>

        <View style={styles.detailSection}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <Text style={styles.detailText}>
            Offline Support:{' '}
            {selectedForm.settings?.allowOffline ? 'Yes' : 'No'}
          </Text>
          <Text style={styles.detailText}>
            Requires Auth: {selectedForm.settings?.requireAuth ? 'Yes' : 'No'}
          </Text>
          <Text style={styles.detailText}>
            Max File Size:{' '}
            {selectedForm.settings?.maxFileSize
              ? `${(selectedForm.settings.maxFileSize / 1024 / 1024).toFixed(1)} MB`
              : 'Not set'}
          </Text>
        </View>

        <View style={styles.detailSection}>
          <Text style={styles.sectionTitle}>
            Fields ({selectedForm.fields.length})
          </Text>
          {selectedForm.fields.map((field, index) => (
            <View key={field.name} style={styles.fieldItem}>
              <Text style={styles.fieldName}>
                {index + 1}. {field.label}
              </Text>
              <Text style={styles.fieldType}>
                Type: {field.type}
                {field.required && (
                  <Text style={styles.requiredText}> (Required)</Text>
                )}
              </Text>
              {field.placeholder && (
                <Text style={styles.fieldPlaceholder}>
                  Placeholder: {field.placeholder}
                </Text>
              )}
              {field.options && field.options.length > 0 && (
                <Text style={styles.fieldOptions}>
                  Options: {field.options.map(opt => opt.label).join(', ')}
                </Text>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Form Configurations</Text>
        <Button
          title={showSearch ? 'Hide Search' : 'Search'}
          onPress={() => setShowSearch(!showSearch)}
          variant='outline'
          size='small'
        />
      </View>

      {/* Search Section */}
      {showSearch && (
        <View style={styles.searchSection}>
          <View style={styles.searchInputContainer}>
            <Text style={styles.searchLabel}>Search Forms</Text>
            <TextInput
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder='Enter form name or description'
              placeholderTextColor={colors.textSecondary}
            />
          </View>
          <Button
            title='Search'
            onPress={handleSearch}
            loading={searchLoading}
            style={styles.searchButton}
          />
        </View>
      )}

      <View style={styles.content}>
        {/* Forms List */}
        <View style={styles.formsList}>
          <Text style={styles.sectionTitle}>Available Forms</Text>
          {listLoading ? (
            <View style={styles.centerContainer}>
              <ActivityIndicator size='large' color={colors.primary} />
              <Text style={styles.loadingText}>Loading forms...</Text>
            </View>
          ) : listError ? (
            <View style={styles.centerContainer}>
              <Text style={styles.errorText}>Error: {listError}</Text>
              <Button title='Retry' onPress={refetchList} />
            </View>
          ) : (
            <ScrollView
              refreshControl={
                <RefreshControl
                  refreshing={listLoading}
                  onRefresh={refetchList}
                />
              }
            >
              {searchResults
                ? searchResults.forms.map(renderFormItem)
                : formsList?.forms.map(renderFormItem)}
            </ScrollView>
          )}
        </View>

        {/* Form Details */}
        <View style={styles.formDetailsContainer}>
          <Text style={styles.sectionTitle}>Form Details</Text>
          {renderFormDetails()}
        </View>
      </View>
    </View>
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
      padding: getSpacing('md'),
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: getSpacing('lg'),
    },
    headerTitle: {
      fontSize: getFontSize(isTablet ? 'xlarge' : 'large'),
      fontWeight: fontWeight.bold,
      color: colors.textPrimary,
    },
    searchSection: {
      backgroundColor: colors.surface,
      padding: getSpacing('md'),
      borderRadius: 8,
      marginBottom: getSpacing('md'),
    },
    searchInputContainer: {
      marginBottom: getSpacing('sm'),
    },
    searchLabel: {
      fontSize: getFontSize('medium'),
      fontWeight: fontWeight.medium,
      color: colors.textPrimary,
      marginBottom: getSpacing('xs'),
    },
    searchInput: {
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      padding: getSpacing('sm'),
      fontSize: getFontSize('medium'),
      color: colors.textPrimary,
    },
    searchButton: {
      marginTop: getSpacing('sm'),
    },
    content: {
      flex: 1,
      flexDirection: isTablet ? 'row' : 'column',
    },
    formsList: {
      flex: isTablet ? 1 : 2,
      marginRight: isTablet ? getSpacing('md') : 0,
      marginBottom: isTablet ? 0 : getSpacing('md'),
    },
    formDetailsContainer: {
      flex: isTablet ? 1 : 3,
    },
    sectionTitle: {
      fontSize: getFontSize('large'),
      fontWeight: fontWeight.bold,
      color: colors.textPrimary,
      marginBottom: getSpacing('md'),
    },
    formItem: {
      backgroundColor: colors.surface,
      padding: getSpacing('md'),
      borderRadius: 8,
      marginBottom: getSpacing('sm'),
      borderWidth: 1,
      borderColor: colors.border,
    },
    selectedFormItem: {
      borderColor: colors.primary,
      backgroundColor: colors.primaryLight,
    },
    formItemHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: getSpacing('xs'),
    },
    formTitle: {
      fontSize: getFontSize('medium'),
      fontWeight: fontWeight.bold,
      color: colors.textPrimary,
      flex: 1,
    },
    formVersion: {
      fontSize: getFontSize('small'),
      color: colors.textSecondary,
      backgroundColor: colors.background,
      paddingHorizontal: getSpacing('xs'),
      paddingVertical: 2,
      borderRadius: 4,
    },
    formDescription: {
      fontSize: getFontSize('small'),
      color: colors.textSecondary,
      marginBottom: getSpacing('xs'),
    },
    formFields: {
      fontSize: getFontSize('small'),
      color: colors.textSecondary,
      fontStyle: 'italic',
      marginBottom: getSpacing('sm'),
    },
    formActions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    actionButton: {
      marginLeft: getSpacing('xs'),
    },
    formDetails: {
      backgroundColor: colors.surface,
      borderRadius: 8,
      padding: getSpacing('md'),
    },
    detailTitle: {
      fontSize: getFontSize('large'),
      fontWeight: fontWeight.bold,
      color: colors.textPrimary,
      marginBottom: getSpacing('sm'),
    },
    detailDescription: {
      fontSize: getFontSize('medium'),
      color: colors.textSecondary,
      marginBottom: getSpacing('lg'),
    },
    detailSection: {
      marginBottom: getSpacing('lg'),
    },
    detailText: {
      fontSize: getFontSize('small'),
      color: colors.textPrimary,
      marginBottom: getSpacing('xs'),
    },
    fieldItem: {
      backgroundColor: colors.background,
      padding: getSpacing('sm'),
      borderRadius: 6,
      marginBottom: getSpacing('xs'),
    },
    fieldName: {
      fontSize: getFontSize('medium'),
      fontWeight: fontWeight.medium,
      color: colors.textPrimary,
      marginBottom: getSpacing('xs'),
    },
    fieldType: {
      fontSize: getFontSize('small'),
      color: colors.textSecondary,
    },
    requiredText: {
      color: colors.error,
      fontWeight: fontWeight.bold,
    },
    fieldPlaceholder: {
      fontSize: getFontSize('small'),
      color: colors.textSecondary,
      fontStyle: 'italic',
    },
    fieldOptions: {
      fontSize: getFontSize('small'),
      color: colors.textSecondary,
    },
    centerContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: getSpacing('lg'),
    },
    loadingText: {
      fontSize: getFontSize('medium'),
      color: colors.textSecondary,
      marginTop: getSpacing('sm'),
    },
    errorText: {
      fontSize: getFontSize('medium'),
      color: colors.error,
      textAlign: 'center',
      marginBottom: getSpacing('md'),
    },
    placeholderText: {
      fontSize: getFontSize('medium'),
      color: colors.textSecondary,
      textAlign: 'center',
      fontStyle: 'italic',
    },
  });
};
