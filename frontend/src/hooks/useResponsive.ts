import { useWindowDimensions } from 'react-native';
import { useState, useEffect } from 'react';
import * as ScreenOrientation from 'expo-screen-orientation';

// Device types
export type DeviceType = 'phone' | 'tablet' | 'desktop';
export type OrientationType = 'portrait' | 'landscape';

// Screen breakpoints
const BREAKPOINTS = {
  PHONE_MAX: 768,
  TABLET_MAX: 1024,
  DESKTOP_MIN: 1025,
};

// Hook for responsive design
export const useResponsive = () => {
  const { width, height } = useWindowDimensions();
  const [orientation, setOrientation] = useState<OrientationType>('portrait');

  useEffect(() => {
    const getOrientation = async () => {
      const orientationInfo = await ScreenOrientation.getOrientationAsync();
      setOrientation(
        orientationInfo === ScreenOrientation.Orientation.PORTRAIT_UP ||
          orientationInfo === ScreenOrientation.Orientation.PORTRAIT_DOWN
          ? 'portrait'
          : 'landscape'
      );
    };

    getOrientation();

    const subscription = ScreenOrientation.addOrientationChangeListener(
      event => {
        setOrientation(
          event.orientationInfo.orientation ===
            ScreenOrientation.Orientation.PORTRAIT_UP ||
            event.orientationInfo.orientation ===
              ScreenOrientation.Orientation.PORTRAIT_DOWN
            ? 'portrait'
            : 'landscape'
        );
      }
    );

    return () => {
      ScreenOrientation.removeOrientationChangeListener(subscription);
    };
  }, []);

  // Determine device type
  const getDeviceType = (): DeviceType => {
    if (width <= BREAKPOINTS.PHONE_MAX) return 'phone';
    if (width <= BREAKPOINTS.TABLET_MAX) return 'tablet';
    return 'desktop';
  };

  const deviceType = getDeviceType();
  const isPhone = deviceType === 'phone';
  const isTablet = deviceType === 'tablet';
  const isDesktop = deviceType === 'desktop';
  const isPortrait = orientation === 'portrait';
  const isLandscape = orientation === 'landscape';

  // Responsive dimensions
  const getColumns = () => {
    if (isPhone) return 1;
    if (isTablet) return isPortrait ? 2 : 3;
    return isPortrait ? 2 : 4;
  };

  const getPadding = () => {
    if (isPhone) return 16;
    if (isTablet) return isPortrait ? 24 : 32;
    return 32;
  };

  const getFontSize = (size: 'small' | 'medium' | 'large' | 'xlarge') => {
    const baseSize = isPhone ? 1 : isTablet ? 1.1 : 1.2;
    const sizes = {
      small: 12 * baseSize,
      medium: 16 * baseSize,
      large: 20 * baseSize,
      xlarge: 24 * baseSize,
    };
    return sizes[size];
  };

  const getSpacing = (size: 'xs' | 'sm' | 'md' | 'lg' | 'xl') => {
    const baseSpacing = isPhone ? 1 : isTablet ? 1.25 : 1.5;
    const spacings = {
      xs: 4 * baseSpacing,
      sm: 8 * baseSpacing,
      md: 16 * baseSpacing,
      lg: 24 * baseSpacing,
      xl: 32 * baseSpacing,
    };
    return spacings[size];
  };

  return {
    width,
    height,
    orientation,
    deviceType,
    isPhone,
    isTablet,
    isDesktop,
    isPortrait,
    isLandscape,
    getColumns,
    getPadding,
    getFontSize,
    getSpacing,
  };
};
