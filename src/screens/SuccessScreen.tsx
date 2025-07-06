import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

const SuccessScreen: React.FC = () => {
  const router = useRouter();
  const { formTitle, submissionTime } = useLocalSearchParams();

  const handleGoHome = () => {
    router.push('/home');
  };

  const handleViewOfflineQueue = () => {
    router.push('/offline-queue');
  };

  const handleSubmitAnother = () => {
    router.push('/form');
  };

  return (
    <View style={styles.container}>
      <View style={styles.successCard}>
        <Text style={styles.successIcon}>✅</Text>
        <Text style={styles.successTitle}>Form Submitted Successfully!</Text>
        <Text style={styles.successMessage}>
          Your form "{formTitle}" has been submitted and saved locally.
        </Text>
        {submissionTime && (
          <Text style={styles.submissionTime}>
            Submitted at: {new Date(Number(submissionTime)).toLocaleString()}
          </Text>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={handleGoHome}
          >
            <Text style={styles.primaryButtonText}>Go to Home</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={handleSubmitAnother}
          >
            <Text style={styles.secondaryButtonText}>Submit Another Form</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={handleViewOfflineQueue}
          >
            <Text style={styles.secondaryButtonText}>View Offline Queue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  successCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    maxWidth: 400,
    width: '100%',
  },
  successIcon: {
    fontSize: 60,
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 15,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 22,
  },
  submissionTime: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginBottom: 25,
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#2E7D32',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#2E7D32',
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#2E7D32',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SuccessScreen;
