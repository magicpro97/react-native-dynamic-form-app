import * as FileSystem from 'expo-file-system';
import { Platform, Alert } from 'react-native';
import { FormConfiguration } from '../services/api';

/**
 * Export form configuration to JSON file
 * @param formConfig - The form configuration to export
 * @param fileName - Optional custom file name (without extension)
 */
export const exportFormConfigurationToJSON = async (
  formConfig: FormConfiguration,
  fileName?: string
): Promise<boolean> => {
  try {
    // Generate file name if not provided
    const defaultFileName = `form-config-${formConfig.title.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}`;
    const finalFileName = fileName || defaultFileName;
    const fileNameWithExtension = `${finalFileName}.json`;

    // Prepare the JSON content
    const jsonContent = JSON.stringify(formConfig, null, 2);

    if (Platform.OS === 'web') {
      // For web platform, use browser download
      downloadJSONFileWeb(jsonContent, fileNameWithExtension);
      return true;
    } else {
      // For mobile platforms, save to device storage
      const fileUri = FileSystem.documentDirectory + fileNameWithExtension;

      await FileSystem.writeAsStringAsync(fileUri, jsonContent, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      // Show success message with file location
      Alert.alert(
        'Export Successful',
        `Form configuration exported successfully!\n\nFile saved to: ${fileUri}`,
        [
          {
            text: 'Open Folder',
            onPress: () => {
              // On mobile, we can't directly open the folder, but we can inform the user
              Alert.alert(
                'File Location',
                `The file has been saved to your app's document directory:\n${fileUri}\n\nYou can access it through your device's file manager.`
              );
            },
          },
          { text: 'OK', style: 'default' },
        ]
      );

      return true;
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error exporting form configuration:', error);
    Alert.alert(
      'Export Failed',
      `Failed to export form configuration: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
    return false;
  }
};

/**
 * Download JSON file in web browser
 * @param content - JSON content as string
 * @param fileName - File name with extension
 */
const downloadJSONFileWeb = (content: string, fileName: string) => {
  const blob = new Blob([content], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up the URL object
  URL.revokeObjectURL(url);

  Alert.alert(
    'Export Successful',
    `Form configuration downloaded as ${fileName}`
  );
};

/**
 * Export multiple form configurations to JSON file
 * @param formConfigs - Array of form configurations to export
 * @param fileName - Optional custom file name (without extension)
 */
export const exportMultipleFormConfigurationsToJSON = async (
  formConfigs: FormConfiguration[],
  fileName?: string
): Promise<boolean> => {
  try {
    const defaultFileName = `form-configs-export-${Date.now()}`;
    const finalFileName = fileName || defaultFileName;
    const fileNameWithExtension = `${finalFileName}.json`;

    // Prepare the JSON content with metadata
    const exportData = {
      exportInfo: {
        exportDate: new Date().toISOString(),
        totalForms: formConfigs.length,
        exportedBy: 'React Native Dynamic Form App',
        version: '1.0.0',
      },
      formConfigurations: formConfigs,
    };

    const jsonContent = JSON.stringify(exportData, null, 2);

    if (Platform.OS === 'web') {
      downloadJSONFileWeb(jsonContent, fileNameWithExtension);
      return true;
    } else {
      const fileUri = FileSystem.documentDirectory + fileNameWithExtension;

      await FileSystem.writeAsStringAsync(fileUri, jsonContent, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      Alert.alert(
        'Export Successful',
        `${formConfigs.length} form configurations exported successfully!\n\nFile saved to: ${fileUri}`,
        [
          {
            text: 'Open Folder',
            onPress: () => {
              Alert.alert(
                'File Location',
                `The file has been saved to your app's document directory:\n${fileUri}`
              );
            },
          },
          { text: 'OK', style: 'default' },
        ]
      );

      return true;
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error exporting form configurations:', error);
    Alert.alert(
      'Export Failed',
      `Failed to export form configurations: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
    return false;
  }
};

/**
 * Get readable file size from bytes
 * @param bytes - Size in bytes
 * @returns Human readable file size
 */
export const getReadableFileSize = (bytes: number): string => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Bytes';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i];
};
