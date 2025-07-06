# 🔧 Technical Specification: Form Data Synchronization

## 📋 Overview

This document provides detailed technical specifications for the form data synchronization system in the React Native Dynamic Form App.

## 🏗️ System Architecture

### **Data Flow Diagram**

```
User Action → Local Storage → Background Sync → Server API → Conflict Resolution → UI Update
     ↓              ↓              ↓              ↓              ↓              ↓
   Form Submit → MMKV Storage → Sync Service → Mock Server → Resolution Logic → Toast/UI
```

### **Component Interactions**

```typescript
// 1. User submits form
FormScreen → saveOfflineForm() → MMKV Storage

// 2. Background sync triggers
BackgroundSyncService → getPendingForms() → syncFormAPI()

// 3. Conflict detection
syncFormAPI() → timestamp comparison → resolution strategy

// 4. UI updates
SyncContext → Toast notifications → Status indicators
```

## 🔄 Synchronization Flow

### **Phase 1: Form Submission**

```typescript
// 1. User fills form and submits
const handleSubmit = async (formData: FormState) => {
  try {
    // Generate unique ID and timestamp
    const formId = generateFormId(); // format: form_timestamp_counter
    const timestamp = Date.now();
    
    // Create offline form record
    const offlineForm: OfflineFormData = {
      id: formId,
      formData,
      timestamp,
      updatedAt: timestamp,
      status: 'pending',
      formTitle: 'Dynamic Form',
      syncAttempts: 0,
    };
    
    // Save to MMKV storage
    const forms = getOfflineForms();
    forms.push(offlineForm);
    storage.set(OFFLINE_FORMS_KEY, JSON.stringify(forms));
    
    // Update pending count
    updatePendingCount();
    
    // Navigate to success screen
    router.push('/success');
    
  } catch (error) {
    showToast('Failed to save form', 'error');
  }
};
```

### **Phase 2: Background Sync Initialization**

```typescript
// Auto-start on app launch
useEffect(() => {
  // Initialize sync service
  const syncService = BackgroundSyncService.getInstance();
  
  // Start background sync (30s interval)
  syncService.start();
  
  // Add sync listener for UI updates
  syncService.addSyncListener(handleSyncStats);
  
  // Cleanup on unmount
  return () => {
    syncService.stop();
    syncService.removeSyncListener(handleSyncStats);
  };
}, []);
```

### **Phase 3: Sync Execution**

```typescript
// Background sync logic
private async syncPendingForms(): Promise<SyncStats> {
  // Step 1: Check network connectivity
  const isOnline = await isNetworkAvailable();
  if (!isOnline) {
    return { 
      total: 0, successful: 0, failed: 0, conflicts: 0, 
      message: 'No network connectivity' 
    };
  }
  
  // Step 2: Get pending forms
  const pendingForms = getPendingForms();
  if (pendingForms.length === 0) {
    return { 
      total: 0, successful: 0, failed: 0, conflicts: 0, 
      message: 'No forms to sync' 
    };
  }
  
  // Step 3: Sync each form
  let successful = 0, failed = 0, conflicts = 0;
  
  for (const form of pendingForms) {
    try {
      const result = await syncFormAPI(form);
      
      if (result.success) {
        switch (result.action) {
          case 'upload':
            updateFormStatus(form.id, 'synced');
            successful++;
            break;
          case 'download':
            updateFormData(form.id, result.serverData.formData);
            updateFormStatus(form.id, 'synced');
            successful++;
            break;
          case 'conflict':
            conflicts++;
            updateFormStatus(form.id, 'failed');
            break;
        }
      } else {
        failed++;
        incrementSyncAttempts(form.id);
        
        if (form.syncAttempts >= 3) {
          updateFormStatus(form.id, 'failed');
        }
      }
    } catch (error) {
      failed++;
      incrementSyncAttempts(form.id);
    }
  }
  
  // Step 4: Return statistics
  return {
    total: pendingForms.length,
    successful,
    failed,
    conflicts,
    message: `Synced ${successful}/${pendingForms.length} forms`,
  };
}
```

### **Phase 4: Conflict Resolution**

```typescript
// Conflict detection algorithm
const detectConflict = (localForm: OfflineFormData, serverForm: OfflineFormData) => {
  const timeDiff = Math.abs(localForm.updatedAt - serverForm.updatedAt);
  const CONFLICT_THRESHOLD = 5000; // 5 seconds
  
  // If timestamps are very close, consider it a conflict
  if (timeDiff < CONFLICT_THRESHOLD) {
    return 'conflict';
  }
  
  // Otherwise, use newer timestamp
  return localForm.updatedAt > serverForm.updatedAt ? 'upload' : 'download';
};

// Resolution strategies
const resolveConflict = (strategy: 'local' | 'server' | 'merge') => {
  switch (strategy) {
    case 'local':
      return { action: 'upload', data: localForm };
    case 'server':
      return { action: 'download', data: serverForm };
    case 'merge':
      return { action: 'merge', data: mergeFormData(localForm, serverForm) };
  }
};
```

## 🗄️ Data Structures

### **OfflineFormData Interface**

```typescript
interface OfflineFormData {
  id: string;                          // Unique identifier
  formData: FormState;                 // Form field values
  timestamp: number;                   // Creation timestamp
  updatedAt: number;                   // Last modification timestamp
  status: 'pending' | 'synced' | 'failed'; // Sync status
  formTitle: string;                   // Form title for display
  syncAttempts: number;                // Number of sync attempts
  conflictReason?: string;             // Reason for conflict (if any)
  serverVersion?: OfflineFormData;     // Server version (for conflict resolution)
}
```

### **FormState Interface**

```typescript
interface FormState {
  [fieldName: string]: any;            // Dynamic field values
  
  // Example fields
  name?: string;
  email?: string;
  phone?: string;
  rating?: string;
  feedback?: string;
  signature?: string;
  photo?: string;
  
  // Metadata
  submittedAt?: number;
  deviceInfo?: {
    platform: string;
    version: string;
    userAgent: string;
  };
}
```

### **SyncStats Interface**

```typescript
interface SyncStats {
  total: number;                       // Total forms processed
  successful: number;                  // Successfully synced forms
  failed: number;                      // Failed sync attempts
  conflicts: number;                   // Conflicted forms
  message: string;                     // User-friendly message
  timestamp: number;                   // Sync completion time
  duration: number;                    // Sync duration (ms)
}
```

## 🔧 API Specifications

### **syncFormAPI Function**

```typescript
interface SyncFormAPIResponse {
  success: boolean;
  message: string;
  action: 'upload' | 'download' | 'conflict';
  serverData?: OfflineFormData;
  conflictDetails?: {
    localTimestamp: number;
    serverTimestamp: number;
    conflictFields: string[];
  };
}

const syncFormAPI = async (form: OfflineFormData): Promise<SyncFormAPIResponse> => {
  // Simulate API call
  await simulateDelay(500);
  
  // Mock server logic
  const serverTimestamp = Date.now() - Math.random() * 10000;
  const timeDiff = form.updatedAt - serverTimestamp;
  
  if (Math.abs(timeDiff) < 1000) {
    // Conflict scenario
    return {
      success: false,
      message: 'Sync conflict detected',
      action: 'conflict',
      conflictDetails: {
        localTimestamp: form.updatedAt,
        serverTimestamp,
        conflictFields: ['name', 'email'], // Example conflicted fields
      },
    };
  } else if (timeDiff > 0) {
    // Local is newer - upload
    return {
      success: true,
      message: 'Form uploaded successfully',
      action: 'upload',
    };
  } else {
    // Server is newer - download
    const serverData: OfflineFormData = {
      ...form,
      formData: { ...form.formData, serverModified: true },
      updatedAt: serverTimestamp,
    };
    
    return {
      success: true,
      message: 'Server version downloaded',
      action: 'download',
      serverData,
    };
  }
};
```

### **Network Detection**

```typescript
const isNetworkAvailable = async (): Promise<boolean> => {
  try {
    const netInfo = await NetInfo.fetch();
    
    // Check both connectivity and internet reachability
    const isConnected = netInfo.isConnected === true;
    const isInternetReachable = netInfo.isInternetReachable === true;
    
    return isConnected && isInternetReachable;
  } catch (error) {
    console.error('Network check failed:', error);
    return false;
  }
};
```

## 🎯 Performance Optimizations

### **Batch Processing**

```typescript
// Process multiple forms in batches
const BATCH_SIZE = 5;

const syncInBatches = async (forms: OfflineFormData[]) => {
  const batches = chunk(forms, BATCH_SIZE);
  
  for (const batch of batches) {
    const promises = batch.map(form => syncFormAPI(form));
    const results = await Promise.allSettled(promises);
    
    // Process results
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        handleSyncSuccess(batch[index], result.value);
      } else {
        handleSyncError(batch[index], result.reason);
      }
    });
    
    // Delay between batches to avoid overwhelming the server
    await sleep(1000);
  }
};
```

### **Memory Management**

```typescript
// Limit stored forms to prevent memory issues
const MAX_STORED_FORMS = 100;

const cleanupOldForms = () => {
  const forms = getOfflineForms();
  
  if (forms.length > MAX_STORED_FORMS) {
    // Keep only the most recent forms
    const sortedForms = forms.sort((a, b) => b.updatedAt - a.updatedAt);
    const formsToKeep = sortedForms.slice(0, MAX_STORED_FORMS);
    
    storage.set(OFFLINE_FORMS_KEY, JSON.stringify(formsToKeep));
  }
};
```

### **Smart Retry Logic**

```typescript
// Exponential backoff with jitter
const calculateRetryDelay = (attempt: number): number => {
  const baseDelay = 1000; // 1 second
  const maxDelay = 60000; // 1 minute
  const jitter = Math.random() * 0.1; // 10% jitter
  
  const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
  return delay * (1 + jitter);
};

const retrySync = async (form: OfflineFormData) => {
  const maxAttempts = 3;
  
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const result = await syncFormAPI(form);
      if (result.success) {
        return result;
      }
    } catch (error) {
      if (attempt === maxAttempts - 1) {
        throw error;
      }
      
      const delay = calculateRetryDelay(attempt);
      await sleep(delay);
    }
  }
};
```

## 🚨 Error Handling

### **Error Types**

```typescript
enum SyncErrorType {
  NETWORK_ERROR = 'network_error',
  SERVER_ERROR = 'server_error',
  CONFLICT_ERROR = 'conflict_error',
  TIMEOUT_ERROR = 'timeout_error',
  STORAGE_ERROR = 'storage_error',
  VALIDATION_ERROR = 'validation_error',
}

interface SyncError {
  type: SyncErrorType;
  message: string;
  formId: string;
  timestamp: number;
  retryable: boolean;
  details?: any;
}
```

### **Error Recovery**

```typescript
const handleSyncError = (form: OfflineFormData, error: SyncError) => {
  switch (error.type) {
    case SyncErrorType.NETWORK_ERROR:
      // Retry later when network is available
      scheduleRetry(form, 30000); // 30 seconds
      break;
      
    case SyncErrorType.SERVER_ERROR:
      // Retry with exponential backoff
      scheduleRetry(form, calculateRetryDelay(form.syncAttempts));
      break;
      
    case SyncErrorType.CONFLICT_ERROR:
      // Mark for manual resolution
      updateFormStatus(form.id, 'failed');
      showConflictDialog(form);
      break;
      
    case SyncErrorType.VALIDATION_ERROR:
      // Mark as failed, requires user intervention
      updateFormStatus(form.id, 'failed');
      showValidationError(form, error.details);
      break;
      
    default:
      // Generic error handling
      incrementSyncAttempts(form.id);
      if (form.syncAttempts >= 3) {
        updateFormStatus(form.id, 'failed');
      }
  }
};
```

## 📊 Monitoring & Analytics

### **Sync Metrics**

```typescript
interface SyncMetrics {
  totalForms: number;
  successRate: number;
  averageSyncTime: number;
  conflictRate: number;
  networkFailureRate: number;
  retryRate: number;
  
  // Time-based metrics
  hourlyStats: Array<{
    hour: number;
    syncCount: number;
    successRate: number;
  }>;
  
  // Error breakdown
  errorTypes: Record<SyncErrorType, number>;
}
```

### **Performance Tracking**

```typescript
const trackSyncPerformance = (stats: SyncStats, duration: number) => {
  // Local analytics
  const metrics = {
    timestamp: Date.now(),
    duration,
    successRate: stats.successful / stats.total,
    conflictRate: stats.conflicts / stats.total,
    totalForms: stats.total,
  };
  
  // Store metrics locally
  const existingMetrics = getStoredMetrics();
  existingMetrics.push(metrics);
  
  // Keep only last 100 entries
  if (existingMetrics.length > 100) {
    existingMetrics.shift();
  }
  
  storage.set('sync_metrics', JSON.stringify(existingMetrics));
  
  // Send to analytics service (if available)
  if (isAnalyticsEnabled()) {
    sendAnalytics('sync_completed', metrics);
  }
};
```

## 🔮 Future Enhancements

### **Advanced Conflict Resolution**

```typescript
// Field-level conflict resolution
interface FieldConflict {
  fieldName: string;
  localValue: any;
  serverValue: any;
  resolution: 'local' | 'server' | 'merge';
}

const resolveFieldConflicts = (
  localForm: OfflineFormData,
  serverForm: OfflineFormData
): FieldConflict[] => {
  const conflicts: FieldConflict[] = [];
  
  Object.keys(localForm.formData).forEach(fieldName => {
    const localValue = localForm.formData[fieldName];
    const serverValue = serverForm.formData[fieldName];
    
    if (localValue !== serverValue) {
      conflicts.push({
        fieldName,
        localValue,
        serverValue,
        resolution: 'local', // Default resolution
      });
    }
  });
  
  return conflicts;
};
```

### **Real-time Sync**

```typescript
// WebSocket-based real-time sync
const initializeRealtimeSync = () => {
  const ws = new WebSocket('wss://api.example.com/sync');
  
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    
    if (data.type === 'form_updated') {
      handleRemoteFormUpdate(data.formId, data.formData);
    }
  };
  
  ws.onopen = () => {
    // Subscribe to form updates
    ws.send(JSON.stringify({
      type: 'subscribe',
      formIds: getPendingForms().map(f => f.id),
    }));
  };
};
```

### **Offline-First PWA Features**

```typescript
// Service Worker for background sync
if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
  navigator.serviceWorker.ready.then(registration => {
    return registration.sync.register('background-sync');
  });
}

// Background sync event handler
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    event.waitUntil(syncPendingForms());
  }
});
```

## 📝 Testing Strategy

### **Unit Tests**

```typescript
describe('Form Sync', () => {
  test('should save form offline', async () => {
    const formData = { name: 'John', email: 'john@example.com' };
    const formId = saveOfflineForm(formData, 'Test Form');
    
    expect(formId).toBeDefined();
    expect(formId).toMatch(/^form_\d+_\d+$/);
    
    const forms = getOfflineForms();
    expect(forms).toHaveLength(1);
    expect(forms[0].formData).toEqual(formData);
  });
  
  test('should handle sync conflicts', async () => {
    const localForm = createMockForm({ updatedAt: 1000 });
    const serverForm = createMockForm({ updatedAt: 1000 });
    
    const result = await syncFormAPI(localForm);
    expect(result.action).toBe('conflict');
    expect(result.success).toBe(false);
  });
});
```

### **Integration Tests**

```typescript
describe('Sync Integration', () => {
  test('should sync forms in background', async () => {
    // Setup
    const syncService = BackgroundSyncService.getInstance();
    const mockForms = [createMockForm(), createMockForm()];
    
    // Mock API responses
    mockSyncAPI.mockResolvedValue({ success: true, action: 'upload' });
    
    // Test sync
    const stats = await syncService.syncNow();
    
    expect(stats.successful).toBe(2);
    expect(stats.failed).toBe(0);
    expect(stats.conflicts).toBe(0);
  });
});
```

---

## 📚 References

- **React Native**: https://reactnative.dev/
- **MMKV**: https://github.com/mrousavy/react-native-mmkv
- **NetInfo**: https://github.com/react-native-netinfo/react-native-netinfo
- **Expo Router**: https://docs.expo.dev/routing/

---

*This technical specification provides comprehensive details about the form data synchronization system implementation. It serves as a reference for developers working on the sync functionality and future enhancements.*
