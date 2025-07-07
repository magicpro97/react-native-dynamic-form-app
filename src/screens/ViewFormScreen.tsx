import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { OfflineFormData } from '../types/form';
import { getOfflineForms } from '../utils/storage';

const ViewFormScreen: React.FC = () => {
  const router = useRouter();
  const { formId } = useLocalSearchParams<{ formId: string }>();
  
  // Find the form by ID
  const form = getOfflineForms().find(f => f.id === formId);

  if (!form) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Form Not Found</Text>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>The requested form could not be found.</Text>
        </View>
      </View>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#FF9800';
      case 'synced':
        return '#4CAF50';
      case 'failed':
        return '#F44336';
      default:
        return '#999';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return '⏳';
      case 'synced':
        return '✅';
      case 'failed':
        return '❌';
      default:
        return '?';
    }
  };

  const renderFieldValue = (key: string, value: any) => {
    if (value === null || value === undefined) {
      return <Text style={styles.fieldValue}>No data</Text>;
    }

    if (typeof value === 'boolean') {
      return <Text style={styles.fieldValue}>{value ? 'Yes' : 'No'}</Text>;
    }

    if (typeof value === 'object' && value.uri) {
      // This is likely a file/image
      return (
        <TouchableOpacity
          style={styles.fileButton}
          onPress={() => Alert.alert('File', `File path: ${value.uri}`)}
        >
          <Text style={styles.fileButtonText}>📎 View File</Text>
        </TouchableOpacity>
      );
    }

    if (Array.isArray(value)) {
      return (
        <View style={styles.arrayContainer}>
          {value.map((item, index) => (
            <Text key={index} style={styles.arrayItem}>
              • {String(item)}
            </Text>
          ))}
        </View>
      );
    }

    return <Text style={styles.fieldValue}>{String(value)}</Text>;
  };

  const formatFieldName = (fieldName: string) => {
    return fieldName
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .replace(/_/g, ' ');
  };

  const handleExportData = () => {
    const formDataString = JSON.stringify(form.formData, null, 2);
    Alert.alert(
      'Export Form Data',
      `Form data (for debugging):\n\n${formDataString}`,
      [
        {
          text: 'Close',
          style: 'cancel',
        },
        {
          text: 'Copy to Clipboard',
          onPress: () => {
            // In a real app, you'd use Clipboard.setString(formDataString)
            Alert.alert('Copied', 'Form data copied to clipboard');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>View Form</Text>
        <TouchableOpacity
          style={styles.exportButton}
          onPress={handleExportData}
        >
          <Text style={styles.exportButtonText}>Export</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Form Meta Information */}
        <View style={styles.metaCard}>
          <Text style={styles.formTitle}>{form.formTitle}</Text>
          
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Status:</Text>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(form.status) },
              ]}
            >
              <Text style={styles.statusText}>
                {getStatusIcon(form.status)} {form.status.toUpperCase()}
              </Text>
            </View>
          </View>

          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Submitted:</Text>
            <Text style={styles.metaValue}>
              {new Date(form.timestamp).toLocaleString()}
            </Text>
          </View>

          {form.updatedAt !== form.timestamp && (
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Updated:</Text>
              <Text style={styles.metaValue}>
                {new Date(form.updatedAt).toLocaleString()}
              </Text>
            </View>
          )}

          {form.syncAttempts && form.syncAttempts > 0 && (
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Sync Attempts:</Text>
              <Text style={styles.metaValue}>{form.syncAttempts}</Text>
            </View>
          )}
        </View>

        {/* Form Data */}
        <View style={styles.dataCard}>
          <Text style={styles.sectionTitle}>Form Data</Text>
          
          {Object.keys(form.formData).length === 0 ? (
            <Text style={styles.emptyData}>No form data available</Text>
          ) : (
            Object.entries(form.formData).map(([key, value]) => (
              <View key={key} style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>{formatFieldName(key)}:</Text>
                {renderFieldValue(key, value)}
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    flex: 0,
  },
  backButtonText: {
    fontSize: 16,
    color: '#2E7D32',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  exportButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  exportButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 15,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 50,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  metaCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  metaLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    minWidth: 100,
  },
  metaValue: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  dataCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  emptyData: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  fieldContainer: {
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 5,
  },
  fieldValue: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  fileButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  fileButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  arrayContainer: {
    marginTop: 5,
  },
  arrayItem: {
    fontSize: 14,
    color: '#333',
    marginBottom: 2,
  },
});

export default ViewFormScreen;
