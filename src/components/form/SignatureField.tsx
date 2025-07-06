import React, { useRef, useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert, Platform } from 'react-native';
import { FormField } from '../../types/form';
import { useForm } from '../../context/FormContext';

// Web-specific signature component
const WebSignatureCanvas: React.FC<{
  onSignature: (signature: string) => void;
  onClear: () => void;
  onCancel: () => void;
}> = ({ onSignature, onClear, onCancel }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 400;
    canvas.height = 200;

    // Set drawing styles
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Fill background
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const startDrawing = (e: any) => {
    if (Platform.OS !== 'web') return;
    
    setIsDrawing(true);
    setIsEmpty(false);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const draw = (e: any) => {
    if (!isDrawing || Platform.OS !== 'web') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    if (Platform.OS !== 'web') return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      setIsEmpty(true);
      onClear();
    }
  };

  const saveSignature = () => {
    if (isEmpty) {
      alert('Please provide a signature');
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataURL = canvas.toDataURL('image/png');
    onSignature(dataURL);
  };

  if (Platform.OS !== 'web') {
    return <View />;
  }

  return (
    <View style={styles.webSignatureContainer}>
      <canvas
        ref={canvasRef}
        style={{
          border: '1px solid #ddd',
          borderRadius: '8px',
          cursor: 'crosshair',
          backgroundColor: '#fff',
          width: '100%',
          height: '200px',
        }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />
      <View style={styles.webSignatureActions}>
        <Button title="Clear" onPress={clearCanvas} />
        <Button title="Cancel" onPress={onCancel} />
        <Button title="Save" onPress={saveSignature} />
      </View>
    </View>
  );
};

// Native signature component (using existing library)
let SignatureScreen: any;
if (Platform.OS !== 'web') {
  try {
    SignatureScreen = require('react-native-signature-canvas').default;
  } catch (e) {
    // Fallback if library is not installed
    SignatureScreen = null;
  }
}

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
    if (Platform.OS === 'web') {
      // Clear handled by web component
      return;
    }
    if (signatureRef.current) {
      signatureRef.current.clearSignature();
    }
  };

  const handleCancel = () => {
    setShowSignature(false);
  };

  const handleEmpty = () => {
    if (Platform.OS === 'web') {
      alert('Please provide a signature');
    } else {
      Alert.alert('Error', 'Please provide a signature');
    }
  };

  // Enhanced web style for native signature component
  const webStyle = `
    .m-signature-pad {
      width: 100%;
      height: 100%;
      border: none;
      background-color: white;
    }
    .m-signature-pad--body {
      border: none;
    }
    .m-signature-pad--footer {
      display: none;
    }
    body, html {
      width: 100%; 
      height: 100%;
      margin: 0;
      padding: 0;
    }
    canvas {
      width: 100% !important;
      height: 100% !important;
      border: none;
    }
  `;

  // Render web signature component
  if (Platform.OS === 'web') {
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
                <Text style={styles.placeholderText}>Tap to add signature</Text>
              )}
            </View>
            <Button
              title={value ? 'Change Signature' : 'Add Signature'}
              onPress={() => setShowSignature(true)}
            />
          </View>
        ) : (
          <View style={styles.signatureContainer}>
            <WebSignatureCanvas
              onSignature={handleSignature}
              onClear={handleClear}
              onCancel={handleCancel}
            />
          </View>
        )}
        
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    );
  }

  // Render native signature component
  if (!SignatureScreen) {
    return (
      <View style={styles.container}>
        <Text style={styles.label}>
          {field.label}
          {field.required && <Text style={styles.required}> *</Text>}
        </Text>
        <View style={[styles.signaturePreview, styles.signatureError]}>
          <Text style={styles.errorText}>Signature component not available</Text>
        </View>
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    );
  }

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
              <Text style={styles.placeholderText}>Tap to add signature</Text>
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
            webStyle={webStyle}
            // Web-specific props
            backgroundColor="white"
            penColor="black"
            minWidth={2}
            maxWidth={4}
            // Better handling for web
            androidHardwareAccelerationDisabled={false}
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
    marginBottom: 24,
    paddingBottom: 8,
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
    marginBottom: 8,
  },
  signatureActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 8,
    backgroundColor: '#f5f5f5',
  },
  webSignatureContainer: {
    height: 250,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 8,
  },
  webSignatureActions: {
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
