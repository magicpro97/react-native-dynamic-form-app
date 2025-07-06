# 🔄 Kiến Trúc Đồng Bộ Dữ Liệu Form

## 📋 Tổng Quan

App sử dụng **offline-first architecture** với hệ thống đồng bộ dữ liệu tự động và xử lý conflict thông minh. Tất cả form data được lưu trữ cục bộ trong MMKV và đồng bộ với server theo chu kỳ.

## 🏗️ Kiến Trúc Tổng Thể

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User Interface │    │  Sync Service   │    │   Server API    │
│                 │    │                 │    │                 │
│ - Form Input    │───▶│ - Background    │───▶│ - REST API      │
│ - Offline Queue │    │   Sync (30s)    │    │ - Conflict      │
│ - Sync Status   │◀───│ - Conflict      │◀───│   Detection     │
│ - Toast Notify  │    │   Resolution    │    │ - Timestamp     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
           │                       │                       │
           ▼                       ▼                       ▼
    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
    │   MMKV Storage  │    │   Network       │    │   Mock Server   │
    │                 │    │   Detection     │    │                 │
    │ - Form Data     │    │                 │    │ - Simulation    │
    │ - Sync Status   │    │ - Online/       │    │ - Random        │
    │ - Timestamps    │    │   Offline       │    │   Scenarios     │
    └─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🔄 Quy Trình Đồng Bộ

### **1. Lưu Trữ Offline**

```typescript
// Khi user submit form
const formId = saveOfflineForm(formData, formTitle);

// Cấu trúc dữ liệu
interface OfflineFormData {
  id: string;                          // Unique ID: form_timestamp_counter
  formData: FormState;                 // Form input data
  timestamp: number;                   // Thời gian tạo
  updatedAt: number;                   // Thời gian cập nhật cuối
  status: 'pending' | 'synced' | 'failed'; // Trạng thái sync
  formTitle: string;                   // Tiêu đề form
  syncAttempts: number;                // Số lần thử sync
}
```

### **2. Background Sync Service**

```typescript
// Tự động sync mỗi 30 giây
class BackgroundSyncService {
  start() {
    this.syncInterval = setInterval(() => {
      this.syncPendingForms();
    }, 30000); // 30 giây
  }
  
  async syncPendingForms() {
    // 1. Kiểm tra network
    // 2. Lấy pending forms
    // 3. Sync từng form
    // 4. Xử lý conflict
    // 5. Update status
    // 6. Notify user
  }
}
```

### **3. Conflict Detection & Resolution**

```typescript
// So sánh timestamp để phát hiện conflict
const syncFormAPI = async (form: OfflineFormData) => {
  // Scenario 1: Local mới hơn Server
  if (localTimestamp > serverTimestamp) {
    return { action: 'upload', success: true };
  }
  
  // Scenario 2: Server mới hơn Local
  if (serverTimestamp > localTimestamp) {
    return { 
      action: 'download', 
      success: true, 
      serverData: newServerData 
    };
  }
  
  // Scenario 3: Conflict (timestamps bằng nhau hoặc concurrent edits)
  return { action: 'conflict', success: false };
};
```

## 📊 Các Trạng Thái Sync

### **Form Status States**

```typescript
type FormStatus = 'pending' | 'synced' | 'failed';

// 'pending' -> Form đang chờ sync
// 'synced'  -> Form đã sync thành công
// 'failed'  -> Form sync thất bại (conflict hoặc lỗi)
```

### **Sync Statistics**

```typescript
interface SyncStats {
  total: number;        // Tổng số form
  successful: number;   // Sync thành công
  failed: number;       // Sync thất bại
  conflicts: number;    // Số conflict
  message: string;      // Thông báo kết quả
}
```

## 🔧 Các Thành Phần Chính

### **1. Storage Layer (`storage.ts`)**

```typescript
// Chức năng chính
- saveOfflineForm()      // Lưu form mới
- getOfflineForms()      // Lấy tất cả forms
- updateFormStatus()     // Cập nhật trạng thái
- updateFormData()       // Cập nhật dữ liệu
- deleteOfflineForm()    // Xóa form
- getPendingForms()      // Lấy forms chờ sync
- clearAllOfflineForms() // Xóa tất cả
```

### **2. Sync Service (`backgroundSync.ts`)**

```typescript
// Chức năng chính
- start()               // Bắt đầu auto sync
- stop()                // Dừng auto sync
- syncNow()             // Sync thủ công
- syncPendingForms()    // Sync logic chính
- addSyncListener()     // Đăng ký listener
- removeSyncListener()  // Hủy listener
```

### **3. API Layer (`api.ts`)**

```typescript
// Chức năng chính
- syncFormAPI()         // Sync một form
- isNetworkAvailable()  // Kiểm tra network
- simulateDelay()       // Mock network delay
```

### **4. Context Management**

```typescript
// SyncContext: Quản lý trạng thái sync
- isSyncing            // Đang sync hay không
- syncStats            // Thống kê sync
- pendingFormsCount    // Số form chờ sync
- syncNow()            // Trigger manual sync

// ToastContext: Quản lý thông báo
- showToast()          // Hiển thị toast
- hideToast()          // Ẩn toast
```

## 🎯 Các Scenario Sync

### **Scenario 1: Upload (Local → Server)**

```typescript
// Local form mới hơn server
Local:  updatedAt: 1704556800000  (2024-01-06 10:00:00)
Server: updatedAt: 1704556700000  (2024-01-06 09:58:20)

Result: Upload local version to server
Status: 'synced'
Toast:  "✅ Synced 1 forms successfully"
```

### **Scenario 2: Download (Server → Local)**

```typescript
// Server form mới hơn local
Local:  updatedAt: 1704556700000  (2024-01-06 09:58:20)
Server: updatedAt: 1704556800000  (2024-01-06 10:00:00)

Result: Download server version to local
Status: 'synced'
Toast:  "✅ Synced 1 forms successfully"
```

### **Scenario 3: Conflict**

```typescript
// Timestamp giống nhau hoặc concurrent edits
Local:  updatedAt: 1704556800000  (2024-01-06 10:00:00)
Server: updatedAt: 1704556800000  (2024-01-06 10:00:00)

Result: Conflict detected
Status: 'failed'
Toast:  "⚠️ 1 forms have conflicts"
```

## 🚨 Xử Lý Lỗi & Retry

### **Retry Logic**

```typescript
// Retry tối đa 3 lần
for (const form of pendingForms) {
  try {
    const result = await syncFormAPI(form);
    // Handle success
  } catch (error) {
    incrementSyncAttempts(form.id);
    
    // Đánh dấu failed sau 3 lần thử
    if (form.syncAttempts >= 3) {
      updateFormStatus(form.id, 'failed');
    }
  }
}
```

### **Error Handling**

```typescript
// Các loại lỗi
1. Network Error    -> Retry later
2. Server Error     -> Retry later
3. Conflict Error   -> Manual resolution
4. Timeout Error    -> Retry later
5. Auth Error       -> Require re-login
```

## 📱 User Experience

### **Toast Notifications**

```typescript
// Success scenarios
"✅ Synced 3 forms successfully"
"✅ Downloaded 1 new form from server"

// Error scenarios  
"❌ Failed to sync 2 forms"
"⚠️ 1 forms have conflicts"
"ℹ️ No network connectivity"
"ℹ️ No forms to sync"
```

### **Sync Status Indicators**

```typescript
// SyncStatus component
🔄 "Syncing..." (isSyncing = true)
✅ "All synced" (pendingCount = 0)
📤 "3 pending" (pendingCount > 0)
⚠️ "Conflicts detected" (conflicts > 0)
❌ "Sync failed" (failed > 0)
```

### **Offline Queue Screen**

```typescript
// Form list với status
┌─────────────────────────┐
│ 📋 Customer Survey      │
│ Status: ✅ Synced       │
│ 2 minutes ago           │
├─────────────────────────┤
│ 📋 Feedback Form       │
│ Status: 📤 Pending     │
│ 5 minutes ago           │
├─────────────────────────┤
│ 📋 Quality Check       │
│ Status: ⚠️ Conflict     │
│ 10 minutes ago          │
└─────────────────────────┘
```

## 🔧 Configuration

### **Sync Settings**

```typescript
// Configurable parameters
const SYNC_INTERVAL = 30000;        // 30 giây
const MAX_RETRY_ATTEMPTS = 3;       // Tối đa 3 lần thử
const NETWORK_TIMEOUT = 10000;      // 10 giây timeout
const TOAST_DURATION = 3000;        // 3 giây hiển thị toast
```

### **Storage Configuration**

```typescript
// MMKV keys
const OFFLINE_FORMS_KEY = 'offline_forms';
const FORM_COUNTER_KEY = 'form_counter';
const AUTH_TOKEN_KEY = 'auth_token';
```

## 🔮 Production Considerations

### **Optimizations**

```typescript
// 1. Batch Sync
// Sync multiple forms in one request

// 2. Delta Sync
// Only sync changed fields

// 3. Compression
// Compress form data before sync

// 4. Priority Queue
// Sync important forms first

// 5. Smart Retry
// Exponential backoff with jitter
```

### **Advanced Conflict Resolution**

```typescript
// 1. Field-level merge
// Merge non-conflicting fields

// 2. 3-way merge
// Use common ancestor for merge

// 3. Operational Transform
// Real-time collaborative editing

// 4. Manual resolution UI
// Let user choose resolution strategy
```

### **Monitoring & Analytics**

```typescript
// Track sync performance
- Sync success rate
- Average sync time
- Conflict frequency
- Network reliability
- User resolution patterns
```

## 🎯 Best Practices

### **Development**

1. **Always test offline scenarios**
2. **Handle network interruptions gracefully**
3. **Provide clear user feedback**
4. **Implement proper error boundaries**
5. **Use TypeScript for type safety**

### **Production**

1. **Monitor sync performance**
2. **Set up error tracking**
3. **Implement analytics**
4. **Plan for data migration**
5. **Test conflict resolution thoroughly**

### **User Experience**

1. **Make sync transparent**
2. **Show progress indicators**
3. **Provide manual sync option**
4. **Handle conflicts gracefully**
5. **Maintain app responsiveness**

---

## 📚 Related Files

- **Storage**: `src/utils/storage.ts`
- **Sync Service**: `src/services/backgroundSync.ts`
- **API Layer**: `src/services/api.ts`
- **Context**: `src/context/SyncContext.tsx`
- **UI Components**: `src/components/sync/SyncStatus.tsx`
- **Toast System**: `src/components/ui/Toast.tsx`

---

*Tài liệu này mô tả chi tiết cách hoạt động của hệ thống đồng bộ dữ liệu trong React Native Dynamic Form App. Hệ thống được thiết kế để đảm bảo tính nhất quán dữ liệu, xử lý conflict thông minh, và trải nghiệm người dùng mượt mà.*
