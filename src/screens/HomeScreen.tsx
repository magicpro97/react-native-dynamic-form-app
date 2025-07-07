import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Button,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SyncStatus } from '../components/sync/SyncStatus';
import { useSyncContext } from '../context/SyncContext';
// Import form.json directly
import formData from '../assets/form.json';

export default function HomeScreen() {
  const [formTitle, setFormTitle] = useState('');
  const [fieldCount, setFieldCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { pendingFormsCount, refreshPendingCount } = useSyncContext();

  useEffect(() => {
    const loadForm = async () => {
      try {
        // Use imported JSON data directly
        setFormTitle(formData.title);
        setFieldCount(formData.fields.length);

        // Refresh pending forms count
        refreshPendingCount();
      } catch {
        setFormTitle('Error loading form');
        setFieldCount(0);
      } finally {
        setLoading(false);
      }
    };
    loadForm();
  }, [refreshPendingCount]);

  const navigateToForm = () => {
    router.push('/form');
  };

  const navigateToResponsiveForm = () => {
    router.push('/responsive-form');
  };

  const navigateToValidationDemo = () => {
    router.push('/validation-demo');
  };

  const navigateToOfflineQueue = () => {
    router.push('/offline-queue');
  };

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{formTitle}</Text>
      <Text style={styles.subtitle}>Number of fields: {fieldCount}</Text>

      {/* Sync Status */}
      <SyncStatus showSyncButton={true} showStats={true} />

      {pendingFormsCount > 0 && (
        <View style={styles.offlineNotice}>
          <Text style={styles.offlineNoticeText}>
            📱 {pendingFormsCount} form{pendingFormsCount > 1 ? 's' : ''}{' '}
            waiting to sync
          </Text>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <Button title='Open Dynamic Form' onPress={navigateToForm} />

        <View style={styles.spacing} />

        <Button
          title='📱 Responsive Form (iPad Optimized)'
          onPress={navigateToResponsiveForm}
        />

        <View style={styles.spacing} />

        <Button title='🔍 Validation Demo' onPress={navigateToValidationDemo} />

        <View style={styles.spacing} />

        <TouchableOpacity
          style={styles.offlineButton}
          onPress={navigateToOfflineQueue}
        >
          <Text style={styles.offlineButtonText}>
            📋 Offline Queue{' '}
            {pendingFormsCount > 0 ? `(${pendingFormsCount})` : ''}
          </Text>
        </TouchableOpacity>

        <View style={styles.spacing} />

        <TouchableOpacity
          style={styles.configButton}
          onPress={() => router.push('/form-configuration' as never)}
        >
          <Text style={styles.configButtonText}>⚙️ Form Configuration API</Text>
        </TouchableOpacity>

        <View style={styles.spacing} />

        <TouchableOpacity
          style={styles.testButton}
          onPress={() => router.push('/validation-test' as never)}
        >
          <Text style={styles.testButtonText}>🧪 Test Validation Rules</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    color: '#555',
  },
  offlineNotice: {
    backgroundColor: '#FFF3E0',
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  offlineNoticeText: {
    fontSize: 14,
    color: '#F57C00',
    fontWeight: '600',
  },
  buttonContainer: {
    marginTop: 24,
    paddingHorizontal: 32,
    width: '100%',
  },
  spacing: {
    height: 16,
  },
  offlineButton: {
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  offlineButtonText: {
    fontSize: 16,
    color: '#1976D2',
    fontWeight: '600',
  },
  configButton: {
    backgroundColor: '#F3E5F5',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#9C27B0',
  },
  configButtonText: {
    fontSize: 16,
    color: '#7B1FA2',
    fontWeight: '600',
  },
  testButton: {
    backgroundColor: '#E8F5E8',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  testButtonText: {
    fontSize: 16,
    color: '#2E7D32',
    fontWeight: '600',
  },
});
