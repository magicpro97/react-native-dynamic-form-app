import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Dynamic Form App',
  slug: 'dynamic-form-app',
  version: '1.0.0',
  orientation: 'default',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  scheme: 'dynamic-form-app',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    bundleIdentifier: 'com.dynamicformapp.app',
    buildNumber: '1.0.0',
    supportsTablet: true,
    infoPlist: {
      NSCameraUsageDescription:
        'This app needs access to camera to capture photos for form fields',
      NSPhotoLibraryUsageDescription:
        'This app needs access to photo library to select images for form fields',
    },
    config: {
      usesNonExemptEncryption: false,
    },
  },
  android: {
    package: 'com.dynamicformapp.app',
    versionCode: 1,
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#FFFFFF',
    },
    permissions: [
      'android.permission.CAMERA',
      'android.permission.READ_EXTERNAL_STORAGE',
      'android.permission.WRITE_EXTERNAL_STORAGE',
    ],
  },
  web: {
    favicon: './assets/favicon.png',
  },
  plugins: [
    'expo-router',
    'expo-screen-orientation',
    [
      'expo-image-picker',
      {
        photosPermission:
          'The app accesses your photos to let you select images for form fields.',
        cameraPermission:
          'The app accesses your camera to let you take photos for form fields.',
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    eas: {
      projectId: 'your-project-id-here',
    },
  },
});
