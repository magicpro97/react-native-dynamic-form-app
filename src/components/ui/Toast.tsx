import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, Animated } from 'react-native';
import { theme } from '../../theme';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  visible: boolean;
  duration?: number;
  onHide?: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type,
  visible,
  duration = 3000,
  onHide,
}) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(-100));

  useEffect(() => {
    if (visible) {
      // Animate in
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto hide after duration
      const timer = setTimeout(() => {
        hideToast();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (onHide) onHide();
    });
  };

  const getToastStyle = () => {
    switch (type) {
      case 'success':
        return { backgroundColor: theme.colors.success, icon: '✅' };
      case 'error':
        return { backgroundColor: theme.colors.error, icon: '❌' };
      case 'warning':
        return { backgroundColor: theme.colors.warning, icon: '⚠️' };
      case 'info':
      default:
        return { backgroundColor: theme.colors.info, icon: 'ℹ️' };
    }
  };

  if (!visible) return null;

  const toastStyle = getToastStyle();

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
          backgroundColor: toastStyle.backgroundColor,
        },
      ]}
    >
      <Text style={styles.icon}>{toastStyle.icon}</Text>
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: theme.spacing.md,
    right: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    zIndex: 1000,
    ...theme.shadows.md,
  },
  icon: {
    fontSize: theme.fontSize.md,
    marginRight: theme.spacing.sm,
  },
  message: {
    flex: 1,
    fontSize: theme.fontSize.sm,
    color: theme.colors.white,
    fontWeight: theme.fontWeight.medium,
  },
});
