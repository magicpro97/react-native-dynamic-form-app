import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme';

export type RiskLevel = 'low' | 'medium' | 'high';

interface RiskIndicatorProps {
  level: RiskLevel;
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
}

const riskConfig = {
  low: {
    color: colors.riskLow,
    label: 'Low Risk',
    icon: '🟢',
  },
  medium: {
    color: colors.riskMedium,
    label: 'Medium Risk',
    icon: '🟡',
  },
  high: {
    color: colors.riskHigh,
    label: 'High Risk',
    icon: '🔴',
  },
};

export const RiskIndicator: React.FC<RiskIndicatorProps> = ({
  level,
  size = 'medium',
  showLabel = true,
}) => {
  const config = riskConfig[level];

  return (
    <View style={[styles.container, styles[size]]}>
      <View style={[styles.indicator, { backgroundColor: config.color }]}>
        <Text style={styles.icon}>{config.icon}</Text>
      </View>
      {showLabel && (
        <Text style={[styles.label, { color: config.color }]}>
          {config.label}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  indicator: {
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  small: {
    gap: 4,
  },
  medium: {
    gap: 8,
  },
  large: {
    gap: 12,
  },
});

// Utility function to get risk level color
export const getRiskColor = (level: RiskLevel): string => {
  return riskConfig[level].color;
};

// Utility function to determine risk level based on field requirements
export const getFieldRiskLevel = (field: {
  required: boolean;
  type: string;
}): RiskLevel => {
  if (field.required) {
    if (field.type === 'signature' || field.type === 'photo') {
      return 'high';
    }
    return 'medium';
  }
  return 'low';
};
