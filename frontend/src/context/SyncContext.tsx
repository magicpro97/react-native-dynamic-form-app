import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { backgroundSyncService, SyncStats } from '../services/backgroundSync';
import { getPendingFormsCount } from '../utils/storage';
import { useToast } from './ToastContext';

interface SyncContextType {
  isSyncing: boolean;
  syncStats: SyncStats | null;
  pendingFormsCount: number;
  startBackgroundSync: () => void;
  stopBackgroundSync: () => void;
  syncNow: () => Promise<void>;
  refreshPendingCount: () => void;
}

const SyncContext = createContext<SyncContextType | undefined>(undefined);

export const useSyncContext = () => {
  const context = useContext(SyncContext);
  if (!context) {
    throw new Error('useSyncContext must be used within a SyncProvider');
  }
  return context;
};

export const SyncProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStats, setSyncStats] = useState<SyncStats | null>(null);
  const [pendingFormsCount, setPendingFormsCount] = useState(0);
  const { showToast } = useToast();

  // Update pending forms count
  const refreshPendingCount = () => {
    setPendingFormsCount(getPendingFormsCount());
  };

  // Sync listener
  const handleSyncStats = (stats: SyncStats) => {
    setSyncStats(stats);
    setIsSyncing(false);
    refreshPendingCount();

    // Show toast notification
    if (stats.successful > 0) {
      showToast(`Synced ${stats.successful} forms successfully`, 'success');
    }
    if (stats.failed > 0) {
      showToast(`Failed to sync ${stats.failed} forms`, 'error');
    }
    if (stats.conflicts > 0) {
      showToast(`${stats.conflicts} forms have conflicts`, 'warning');
    }
  };

  // Start background sync
  const startBackgroundSync = () => {
    backgroundSyncService.start();
    backgroundSyncService.addSyncListener(handleSyncStats);
  };

  // Stop background sync
  const stopBackgroundSync = () => {
    backgroundSyncService.stop();
    backgroundSyncService.removeSyncListener(handleSyncStats);
  };

  // Manual sync
  const syncNow = async () => {
    setIsSyncing(true);
    try {
      const stats = await backgroundSyncService.syncNow();
      setSyncStats(stats);
    } catch {
      // Sync error handled silently
    } finally {
      setIsSyncing(false);
      refreshPendingCount();
    }
  };

  // Initialize on mount
  useEffect(() => {
    refreshPendingCount();
    startBackgroundSync();

    return () => {
      stopBackgroundSync();
    };
  }, []);

  return (
    <SyncContext.Provider
      value={{
        isSyncing,
        syncStats,
        pendingFormsCount,
        startBackgroundSync,
        stopBackgroundSync,
        syncNow,
        refreshPendingCount,
      }}
    >
      {children}
    </SyncContext.Provider>
  );
};
