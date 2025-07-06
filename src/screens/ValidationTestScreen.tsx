import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ValidationTestComponent } from '../components/ValidationTestComponent';

export default function ValidationTestScreen() {
  return (
    <View style={styles.container}>
      <ValidationTestComponent />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
