import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import {
  colors,
  spacing,
  borderRadius as themeRadius,
  fontSize,
  fontWeight,
  shadows,
} from '../../theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: keyof typeof spacing;
  shadow?: keyof typeof shadows;
  borderRadius?: keyof typeof themeRadius;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  padding = 'md',
  shadow = 'sm',
  borderRadius: radius = 'md',
}) => {
  return (
    <View
      style={[
        styles.card,
        {
          padding: spacing[padding],
          borderRadius: themeRadius[radius],
          ...shadows[shadow],
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
}) => {
  const buttonStyle = [
    styles.button,
    styles[`button_${variant}` as keyof typeof styles] as ViewStyle,
    styles[`button_${size}` as keyof typeof styles] as ViewStyle,
    fullWidth && styles.buttonFullWidth,
    disabled && styles.buttonDisabled,
    style,
  ].filter(Boolean);

  const textStyle = [
    styles.buttonText,
    styles[`buttonText_${variant}` as keyof typeof styles],
    styles[`buttonText_${size}` as keyof typeof styles],
    disabled && styles.buttonTextDisabled,
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={!disabled ? onPress : undefined}
      disabled={disabled}
    >
      <Text style={textStyle}>{loading ? 'Loading...' : title}</Text>
    </TouchableOpacity>
  );
};

interface TextProps {
  children: React.ReactNode;
  variant?: 'h1' | 'h2' | 'h3' | 'body1' | 'body2' | 'caption';
  color?: string;
  style?: object;
}

export const Typography: React.FC<TextProps> = ({
  children,
  variant = 'body1',
  color = colors.textPrimary,
  style,
}) => {
  return (
    <Text
      style={[
        styles[`text_${variant}` as keyof typeof styles],
        { color },
        style,
      ]}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  // Card styles
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },

  // Button styles
  button: {
    borderRadius: themeRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  button_primary: {
    backgroundColor: colors.primary,
  },
  button_secondary: {
    backgroundColor: colors.secondary,
  },
  button_outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  button_ghost: {
    backgroundColor: 'transparent',
  },
  button_small: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    minHeight: 32,
  },
  button_medium: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minHeight: 44,
  },
  button_large: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    minHeight: 56,
  },
  buttonFullWidth: {
    width: '100%',
  },
  buttonDisabled: {
    opacity: 0.6,
  },

  // Button text styles
  buttonText: {
    textAlign: 'center',
    fontWeight: fontWeight.semibold,
  },
  buttonText_primary: {
    color: colors.textOnPrimary,
  },
  buttonText_secondary: {
    color: colors.textOnSecondary,
  },
  buttonText_outline: {
    color: colors.primary,
  },
  buttonText_ghost: {
    color: colors.primary,
  },
  buttonText_small: {
    fontSize: fontSize.sm,
  },
  buttonText_medium: {
    fontSize: fontSize.md,
  },
  buttonText_large: {
    fontSize: fontSize.lg,
  },
  buttonTextDisabled: {
    opacity: 0.6,
  },

  // Typography styles
  text_h1: {
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold,
    lineHeight: 40,
  },
  text_h2: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    lineHeight: 32,
  },
  text_h3: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.semibold,
    lineHeight: 28,
  },
  text_body1: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.normal,
    lineHeight: 24,
  },
  text_body2: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.normal,
    lineHeight: 20,
  },
  text_caption: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.normal,
    lineHeight: 16,
  },
});
