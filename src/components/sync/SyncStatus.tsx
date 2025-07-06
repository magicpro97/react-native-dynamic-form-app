import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSyncContext } from '../../context/SyncContext';
import { theme } from '../../theme';

interface SyncStatusProps {
  showSyncButton?: boolean;
  showStats?: boolean;
}

export const SyncStatus: React.FC<SyncStatusProps> = ({
  showSyncButton = true,
  showStats = true,
}) => {
  const { isSyncing, syncStats, pendingFormsCount, syncNow } = useSyncContext();

  if (!showStats && !showSyncButton) {
    return null;
  }

  const getSyncStatusColor = () => {
    if (isSyncing) return theme.colors.primary;
    if (pendingFormsCount > 0) return theme.colors.warning;
    return theme.colors.success;
  };

  const getSyncStatusText = () => {
    if (isSyncing) return 'Syncing...';
    if (pendingFormsCount > 0) return `${pendingFormsCount} pending`;
    return 'All synced';
  };

  return (
    <View style={styles.container}>
      {showStats && (
        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusDot,
              { backgroundColor: getSyncStatusColor() },
            ]}
          />
          <Text style={styles.statusText}>{getSyncStatusText()}</Text>
        </View>
      )}

      {showSyncButton && (
        <TouchableOpacity
          style={[styles.syncButton, isSyncing && styles.syncButtonDisabled]}
          onPress={syncNow}
          disabled={isSyncing}
        >
          <Text
            style={[
              styles.syncButtonText,
              isSyncing && styles.syncButtonTextDisabled,
            ]}
          >
            {isSyncing ? 'Syncing...' : 'Sync Now'}
          </Text>
        </TouchableOpacity>
      )}

      {showStats && syncStats && (
        <Text style={styles.lastSyncText}>Last sync: {syncStats.message}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: theme.spacing.xs,
  },
  statusText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textPrimary,
  },
  syncButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    marginVertical: theme.spacing.xs,
  },
  syncButtonDisabled: {
    backgroundColor: theme.colors.gray400,
  },
  syncButtonText: {
    color: theme.colors.white,
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
  },
  syncButtonTextDisabled: {
    color: theme.colors.textDisabled,
  },
  lastSyncText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
});
