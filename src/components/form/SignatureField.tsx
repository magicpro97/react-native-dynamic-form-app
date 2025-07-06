import React, { useRef, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import SignatureScreen from 'react-native-signature-canvas';
import { FormField } from '../../types/form';
import { useForm } from '../../context/FormContext';

interface SignatureFieldProps {
  field: FormField;
}

export const SignatureField: React.FC<SignatureFieldProps> = ({ field }) => {
  const { formState, setField, errors } = useForm();
  const [showSignature, setShowSignature] = useState(false);
  const signatureRef = useRef<any>(null);
  const value = formState[field.name] || '';
  const error = errors[field.name];

  const handleSignature = (signature: string) => {
    setField(field.name, signature);
    setShowSignature(false);
  };

  const handleClear = () => {
    if (signatureRef.current) {
      signatureRef.current.clearSignature();
    }
  };

  const handleCancel = () => {
    setShowSignature(false);
  };

  const handleEmpty = () => {
    Alert.alert('Error', 'Please provide a signature');
  };

  const style = `.m-signature-pad--footer
    .m-signature-pad--footer .description {
      display: none;
    }
    .m-signature-pad--footer .signature-pad--actions {
      display: none;
    }
    body,html {
      width: 100%; height: 100%;
    }`;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {field.label}
        {field.required && <Text style={styles.required}> *</Text>}
      </Text>
      
      {!showSignature ? (
        <View>
          <View style={[styles.signaturePreview, error && styles.signatureError]}>
            {value ? (
              <Text style={styles.signatureText}>✓ Signature captured</Text>
            ) : (
              <Text style={styles.placeholderText}>No signature</Text>
            )}
          </View>
          <Button
            title={value ? 'Change Signature' : 'Add Signature'}
            onPress={() => setShowSignature(true)}
          />
        </View>
      ) : (
        <View style={styles.signatureContainer}>
          <SignatureScreen
            ref={signatureRef}
            onOK={handleSignature}
            onEmpty={handleEmpty}
            onClear={handleClear}
            autoClear={false}
            descriptionText="Sign here"
            clearText="Clear"
            confirmText="Save"
            webStyle={style}
          />
          <View style={styles.signatureActions}>
            <Button title="Clear" onPress={handleClear} />
            <Button title="Cancel" onPress={handleCancel} />
          </View>
        </View>
      )}
      
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
  signaturePreview: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 8,
    minHeight: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signatureError: {
    borderColor: '#ff4444',
  },
  signatureText: {
    color: '#007AFF',
    fontSize: 16,
  },
  placeholderText: {
    color: '#999',
    fontSize: 16,
  },
  signatureContainer: {
    height: 300,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
  },
  signatureActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 8,
    backgroundColor: '#f5f5f5',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 14,
    marginTop: 4,
  },
});
