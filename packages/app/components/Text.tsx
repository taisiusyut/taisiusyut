import React from 'react';
import { Text as RNText, TextProps as RNTextProps } from 'react-native';
import { StyleService } from '@/styles';

export interface TextProps extends RNTextProps {
  children?: string | string[];
}

export function Text({ style, ...props }: TextProps) {
  return (
    <RNText
      {...props}
      style={[{ color: StyleService.get('text'), fontSize: 16 }, style]}
    />
  );
}
