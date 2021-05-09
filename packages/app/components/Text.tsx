import React from 'react';
import { Text as RNText, TextProps as RNTextProps } from 'react-native';
import { makeStyles } from '@/styles';

const useStyles = makeStyles(theme => ({
  text: { color: theme.text, fontSize: 16 }
}));

export interface TextProps extends RNTextProps {
  children?: string | string[];
}

export function Text({ style, ...props }: TextProps) {
  const styles = useStyles();
  return <RNText {...props} style={[styles.text, style]} />;
}
