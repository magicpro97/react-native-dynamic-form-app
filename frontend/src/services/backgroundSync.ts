import { isNetworkAvailable, syncFormAPI } from './api';
import {
  getPendingForms,
  updateFormStatus,
  updateFormData,
  incrementSyncAttempts,
} from '../utils/storage';

// Background sync service
export class BackgroundSyncService {
  private static instance: BackgroundSyncService;
  private syncInterval: ReturnType<typeof setInterval> | null = null;
  private isSyncing = false;
  private syncListeners: Array<(stats: SyncStats) => void> = [];

  private constructor() {}

  static getInstance(): BackgroundSyncService {
    if (!BackgroundSyncService.instance) {
      BackgroundSyncService.instance = new BackgroundSyncService();
    }
    return BackgroundSyncService.instance;
  }

  // Start background sync
  start(): void {
    if (this.syncInterval) {
      this.stop();
    }

    // Sync every 30 seconds
    this.syncInterval = setInterval(() => {
      this.syncPendingForms();
    }, 30000);
  }

  // Stop background sync
  stop(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  // Add sync listener
  addSyncListener(listener: (stats: SyncStats) => void): void {
    this.syncListeners.push(listener);
  }

  // Remove sync listener
  removeSyncListener(listener: (stats: SyncStats) => void): void {
    this.syncListeners = this.syncListeners.filter(l => l !== listener);
  }

  // Notify listeners
  private notifyListeners(stats: SyncStats): void {
    this.syncListeners.forEach(listener => listener(stats));
  }

  // Manual sync trigger
  async syncNow(): Promise<SyncStats> {
    return this.syncPendingForms();
  }

  // Main sync logic
  private async syncPendingForms(): Promise<SyncStats> {
    if (this.isSyncing) {
      return {
        total: 0,
        successful: 0,
        failed: 0,
        conflicts: 0,
        message: 'Sync already in progress',
      };
    }

    this.isSyncing = true;

    try {
      // Check network connectivity
      const isOnline = await isNetworkAvailable();
      if (!isOnline) {
        return {
          total: 0,
          successful: 0,
          failed: 0,
          conflicts: 0,
          message: 'No network connectivity',
        };
      }

      // Get all pending forms
      const pendingForms = getPendingForms();
      if (pendingForms.length === 0) {
        return {
          total: 0,
          successful: 0,
          failed: 0,
          conflicts: 0,
          message: 'No forms to sync',
        };
      }

      let successful = 0;
      let failed = 0;
      let conflicts = 0;

      // Sync each form
      for (const form of pendingForms) {
        try {
          const result = await syncFormAPI(form);

          if (result.success) {
            switch (result.action) {
              case 'upload':
                // Form uploaded successfully
                updateFormStatus(form.id, 'synced');
                successful++;
                break;

              case 'download':
                // Server version is newer, update local
                if (result.serverData) {
                  updateFormData(form.id, result.serverData.formData);
                  updateFormStatus(form.id, 'synced');
                  successful++;
                }
                break;

              case 'conflict':
                // Handle conflict
                conflicts++;
                updateFormStatus(form.id, 'failed');
                break;
            }
          } else {
            // Sync failed
            failed++;
            incrementSyncAttempts(form.id);

            // Mark as failed if too many attempts
            if ((form.syncAttempts || 0) >= 3) {
              updateFormStatus(form.id, 'failed');
            }
          }
        } catch {
          failed++;
          incrementSyncAttempts(form.id);

          // Mark as failed if too many attempts
          if ((form.syncAttempts || 0) >= 3) {
            updateFormStatus(form.id, 'failed');
          }
        }
      }

      const stats: SyncStats = {
        total: pendingForms.length,
        successful,
        failed,
        conflicts,
        message: `Synced ${successful}/${pendingForms.length} forms`,
      };

      this.notifyListeners(stats);

      return stats;
    } finally {
      this.isSyncing = false;
    }
  }
}

// Sync statistics interface
export interface SyncStats {
  total: number;
  successful: number;
  failed: number;
  conflicts: number;
  message: string;
}

// Export singleton instance
export const backgroundSyncService = BackgroundSyncService.getInstance();
