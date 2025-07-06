import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Button } from 'react-native';
import { useRouter } from 'expo-router';
// Import form.json directly
import formData from '../assets/form.json';

export default function HomeScreen() {
  const [formTitle, setFormTitle] = useState('');
  const [fieldCount, setFieldCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadForm = async () => {
      try {
        // Use imported JSON data directly
        setFormTitle(formData.title);
        setFieldCount(formData.fields.length);
      } catch (e) {
        setFormTitle('Error loading form');
        setFieldCount(0);
      } finally {
        setLoading(false);
      }
    };
    loadForm();
  }, []);

  const navigateToForm = () => {
    router.push('/form');
  };

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{formTitle}</Text>
      <Text style={styles.subtitle}>Number of fields: {fieldCount}</Text>
      <View style={styles.buttonContainer}>
        <Button title="Open Dynamic Form" onPress={navigateToForm} />
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
  buttonContainer: {
    marginTop: 24,
    paddingHorizontal: 32,
  },
});
