import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { validators } from '../utils/validation';

export const ValidationTestComponent = () => {
  const [testResults, setTestResults] = useState<string[]>([]);

  const runAllTests = () => {
    const results: string[] = [];

    // Test required
    results.push('=== Required Tests ===');
    results.push(`Empty: ${validators.required('')}`);
    results.push(`Non-empty: ${validators.required('hello')}`);
    results.push(`Null: ${validators.required(null)}`);

    // Test email
    results.push('\n=== Email Tests ===');
    results.push(`Valid: ${validators.email('test@example.com')}`);
    results.push(`Invalid: ${validators.email('not-email')}`);

    // Test phone
    results.push('\n=== Phone Tests ===');
    results.push(`Valid: ${validators.phone('+1234567890')}`);
    results.push(`Invalid: ${validators.phone('not-phone')}`);

    // Test minLength
    results.push('\n=== MinLength Tests ===');
    results.push(`Length 5, min 3: ${validators.minLength('hello', 3)}`);
    results.push(`Length 2, min 5: ${validators.minLength('hi', 5)}`);

    // Test maxLength
    results.push('\n=== MaxLength Tests ===');
    results.push(`Length 5, max 10: ${validators.maxLength('hello', 10)}`);
    results.push(
      `Length 15, max 10: ${validators.maxLength('this is too long', 10)}`,
    );

    // Test pattern
    results.push('\n=== Pattern Tests ===');
    results.push(`Valid: ${validators.pattern('test123', /^[a-zA-Z0-9]+$/)}`);
    results.push(`Invalid: ${validators.pattern('test@#$', /^[a-zA-Z0-9]+$/)}`);

    // Test positive number
    results.push('\n=== Positive Number Tests ===');
    results.push(`Positive: ${validators.positiveNumber('42')}`);
    results.push(`Negative: ${validators.positiveNumber('-5')}`);
    results.push(`Zero: ${validators.positiveNumber('0')}`);

    // Test currency
    results.push('\n=== Currency Tests ===');
    results.push(`Valid: ${validators.currency('19.99')}`);
    results.push(`Invalid: ${validators.currency('19.999')}`);
    results.push(`No decimal: ${validators.currency('100')}`);

    // Test date
    results.push('\n=== Date Tests ===');
    results.push(`Valid: ${validators.date('2023-12-25')}`);
    results.push(`Invalid: ${validators.date('not-a-date')}`);

    // Test future date
    results.push('\n=== Future Date Tests ===');
    results.push(`Future: ${validators.futureDate('2030-01-01')}`);
    results.push(`Past: ${validators.futureDate('2020-01-01')}`);

    // Test past date
    results.push('\n=== Past Date Tests ===');
    results.push(`Past: ${validators.pastDate('2020-01-01')}`);
    results.push(`Future: ${validators.pastDate('2030-01-01')}`);

    setTestResults(results);

    Alert.alert('Validation Test Results', results.join('\n'), [
      { text: 'OK' },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Validation Test Component</Text>
      <TouchableOpacity style={styles.button} onPress={runAllTests}>
        <Text style={styles.buttonText}>Run All Tests</Text>
      </TouchableOpacity>

      {testResults.length > 0 && (
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsTitle}>Test Results:</Text>
          {testResults.map((result, index) => (
            <Text key={index} style={styles.resultText}>
              {result}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultsContainer: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
    maxHeight: 400,
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  resultText: {
    fontSize: 12,
    marginBottom: 2,
    fontFamily: 'monospace',
  },
});
