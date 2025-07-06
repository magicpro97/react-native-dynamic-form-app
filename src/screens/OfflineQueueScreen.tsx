import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert, 
  RefreshControl 
} from 'react-native';
import { useRouter } from 'expo-router';
import { 
  getOfflineForms, 
  deleteOfflineForm, 
  updateFormStatus, 
  clearAllOfflineForms 
} from '../utils/storage';
import { submitFormAPI, isNetworkAvailable } from '../services/api';
import { OfflineFormData } from '../types/form';
import { SyncStatus } from '../components/sync/SyncStatus';
import { useSyncContext } from '../context/SyncContext';

const OfflineQueueScreen: React.FC = () => {
  const [offlineForms, setOfflineForms] = useState<OfflineFormData[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const router = useRouter();
  const { refreshPendingCount } = useSyncContext();

  useEffect(() => {
    loadOfflineForms();
  }, []);

  const loadOfflineForms = () => {
    const forms = getOfflineForms();
    setOfflineForms(forms);
    refreshPendingCount();
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    loadOfflineForms();
    setIsRefreshing(false);
  };

  const handleDeleteForm = (formId: string) => {
    Alert.alert(
      'Delete Form',
      'Are you sure you want to delete this form?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            deleteOfflineForm(formId);
            loadOfflineForms();
          }
        }
      ]
    );
  };

  const handleViewForm = (form: OfflineFormData) => {
    Alert.alert(
      'Form Details',
      `Title: ${form.formTitle}\nSubmitted: ${new Date(form.timestamp).toLocaleString()}\nStatus: ${form.status}\n\nData: ${JSON.stringify(form.formData, null, 2)}`,
      [{ text: 'OK' }]
    );
  };

  const handleSyncForm = async (form: OfflineFormData) => {
    try {
      updateFormStatus(form.id, 'pending');
      loadOfflineForms();

      const networkAvailable = await isNetworkAvailable();
      if (!networkAvailable) {
        Alert.alert('No Network', 'Please check your internet connection and try again.');
        return;
      }

      const response = await submitFormAPI(form.formData);
      
      if (response.success) {
        updateFormStatus(form.id, 'synced');
        Alert.alert('Success', 'Form synced successfully!');
      } else {
        updateFormStatus(form.id, 'failed');
        Alert.alert('Sync Failed', response.message);
      }
      
      loadOfflineForms();
    } catch (error) {
      updateFormStatus(form.id, 'failed');
      Alert.alert('Error', 'Failed to sync form. Please try again.');
      loadOfflineForms();
    }
  };

  const handleSyncAll = async () => {
    const pendingForms = offlineForms.filter(form => form.status === 'pending');
    
    if (pendingForms.length === 0) {
      Alert.alert('No Pending Forms', 'All forms are already synced.');
      return;
    }

    Alert.alert(
      'Sync All Forms',
      `Are you sure you want to sync ${pendingForms.length} pending forms?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sync All', 
          onPress: async () => {
            try {
              const networkAvailable = await isNetworkAvailable();
              if (!networkAvailable) {
                Alert.alert('No Network', 'Please check your internet connection and try again.');
                return;
              }

              let syncedCount = 0;
              let failedCount = 0;

              for (const form of pendingForms) {
                try {
                  const response = await submitFormAPI(form.formData);
                  if (response.success) {
                    updateFormStatus(form.id, 'synced');
                    syncedCount++;
                  } else {
                    updateFormStatus(form.id, 'failed');
                    failedCount++;
                  }
                } catch (error) {
                  updateFormStatus(form.id, 'failed');
                  failedCount++;
                }
              }

              Alert.alert(
                'Sync Complete',
                `Successfully synced: ${syncedCount}\nFailed: ${failedCount}`
              );
              
              loadOfflineForms();
            } catch (error) {
              Alert.alert('Error', 'Failed to sync forms. Please try again.');
            }
          }
        }
      ]
    );
  };

  const handleClearAll = () => {
    Alert.alert(
      'Clear All Forms',
      'Are you sure you want to delete all offline forms? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear All', 
          style: 'destructive',
          onPress: () => {
            clearAllOfflineForms();
            loadOfflineForms();
          }
        }
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#FF9800';
      case 'synced': return '#4CAF50';
      case 'failed': return '#F44336';
      default: return '#999';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'synced': return '✅';
      case 'failed': return '❌';
      default: return '?';
    }
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
        <Text style={styles.title}>Offline Queue ({offlineForms.length})</Text>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.syncButton]}
          onPress={handleSyncAll}
        >
          <Text style={styles.syncButtonText}>
            Sync All
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.clearButton]}
          onPress={handleClearAll}
        >
          <Text style={styles.clearButtonText}>Clear All</Text>
        </TouchableOpacity>
      </View>

      {/* Add Sync Status Component */}
      <SyncStatus showSyncButton={false} showStats={true} />

      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      >
        {offlineForms.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No offline forms found</Text>
            <TouchableOpacity 
              style={styles.createFormButton}
              onPress={() => router.push('/form')}
            >
              <Text style={styles.createFormButtonText}>Create New Form</Text>
            </TouchableOpacity>
          </View>
        ) : (
          offlineForms.map((form) => (
            <View key={form.id} style={styles.formCard}>
              <View style={styles.formHeader}>
                <Text style={styles.formTitle}>{form.formTitle}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(form.status) }]}>
                  <Text style={styles.statusText}>
                    {getStatusIcon(form.status)} {form.status.toUpperCase()}
                  </Text>
                </View>
              </View>
              
              <Text style={styles.formTime}>
                {new Date(form.timestamp).toLocaleString()}
              </Text>
              
              <View style={styles.formActions}>
                <TouchableOpacity 
                  style={[styles.actionBtn, styles.viewBtn]}
                  onPress={() => handleViewForm(form)}
                >
                  <Text style={styles.viewBtnText}>View</Text>
                </TouchableOpacity>
                
                {form.status === 'pending' && (
                  <TouchableOpacity 
                    style={[styles.actionBtn, styles.syncBtn]}
                    onPress={() => handleSyncForm(form)}
                  >
                    <Text style={styles.syncBtnText}>Sync</Text>
                  </TouchableOpacity>
                )}
                
                <TouchableOpacity 
                  style={[styles.actionBtn, styles.deleteBtn]}
                  onPress={() => handleDeleteForm(form.id)}
                >
                  <Text style={styles.deleteBtnText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    marginRight: 15,
  },
  backButtonText: {
    fontSize: 16,
    color: '#2E7D32',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 15,
    gap: 10,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  syncButton: {
    backgroundColor: '#2E7D32',
  },
  clearButton: {
    backgroundColor: '#F44336',
  },
  syncButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  clearButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 50,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  createFormButton: {
    backgroundColor: '#2E7D32',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  createFormButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  formCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    marginTop: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: 'bold',
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
  formTime: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  formActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    flex: 1,
    alignItems: 'center',
  },
  viewBtn: {
    backgroundColor: '#2196F3',
  },
  syncBtn: {
    backgroundColor: '#FF9800',
  },
  deleteBtn: {
    backgroundColor: '#F44336',
  },
  viewBtnText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  syncBtnText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  deleteBtnText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default OfflineQueueScreen;
