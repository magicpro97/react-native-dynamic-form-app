import React, { useState } from 'react';
import { View, Text, Button, Image, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { FormField } from '../../types/form';
import { useForm } from '../../context/FormContext';

interface PhotoFieldProps {
  field: FormField;
}

export const PhotoField: React.FC<PhotoFieldProps> = ({ field }) => {
  const { formState, setField, errors } = useForm();
  const [loading, setLoading] = useState(false);
  const value = formState[field.name] || '';
  const error = errors[field.name];

  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission required',
        'Please grant photo library access to use this feature.',
      );
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) return;

    setLoading(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
        base64: true,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const base64Image = `data:${asset.type || 'image/jpeg'};base64,${asset.base64}`;
        setField(field.name, base64Image);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    } finally {
      setLoading(false);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission required',
        'Please grant camera access to use this feature.',
      );
      return;
    }

    setLoading(true);
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
        base64: true,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const base64Image = `data:${asset.type || 'image/jpeg'};base64,${asset.base64}`;
        setField(field.name, base64Image);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo');
    } finally {
      setLoading(false);
    }
  };

  const showImageOptions = () => {
    Alert.alert('Select Photo', 'Choose an option', [
      { text: 'Camera', onPress: takePhoto },
      { text: 'Photo Library', onPress: pickImage },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const removeImage = () => {
    setField(field.name, '');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {field.label}
        {field.required && <Text style={styles.required}> *</Text>}
      </Text>

      <View style={[styles.photoContainer, error && styles.photoError]}>
        {value ? (
          <View style={styles.imageContainer}>
            <Image source={{ uri: value }} style={styles.image} />
            <View style={styles.imageActions}>
              <Button
                title='Change Photo'
                onPress={showImageOptions}
                disabled={loading}
              />
              <Button title='Remove' onPress={removeImage} color='#ff4444' />
            </View>
          </View>
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>No photo selected</Text>
            <Button
              title={loading ? 'Loading...' : 'Add Photo'}
              onPress={showImageOptions}
              disabled={loading}
            />
          </View>
        )}
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  required: {
    color: '#ff4444',
  },
  photoContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  photoError: {
    borderColor: '#ff4444',
  },
  imageContainer: {
    alignItems: 'center',
    padding: 16,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  imageActions: {
    flexDirection: 'row',
    gap: 8,
  },
  placeholder: {
    alignItems: 'center',
    padding: 32,
    minHeight: 100,
    justifyContent: 'center',
  },
  placeholderText: {
    color: '#999',
    fontSize: 16,
    marginBottom: 16,
  },
  errorText: {
    color: '#ff4444',
    fontSize: 14,
    marginTop: 4,
  },
});
