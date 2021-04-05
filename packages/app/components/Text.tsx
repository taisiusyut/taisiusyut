import React from 'react';
import { Text as RNText, TextProps as RNTextProps } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { colors } from '@/utils/color';

export interface TextProps extends RNTextProps {
  children?: string;
}

export function Text({ style, ...props }: TextProps) {
  const theme = useColorScheme();
  const color = colors[theme];
  return (
    <RNText {...props} style={[{ color: color.text, fontSize: 16 }, style]} />
  );
}
