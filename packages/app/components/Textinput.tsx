import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  StyleSheet,
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  ViewStyle
} from 'react-native';
import { shadow } from '@/utils/shadow';
import { lighten, colors } from '@/utils/color';
import { ControlProps } from '@/utils/form';

interface StylesOption {
  // color: string;
  hasError?: boolean;
  focused?: boolean;
}

export interface TextInputProps
  extends Omit<RNTextInputProps, 'onChange'>,
    ControlProps<string> {
  hasError?: boolean;
}

const height = 34;
const fontSize = 16;

const getStyles = ({ hasError, focused }: StylesOption = {}) => {
  const color = hasError ? colors.red : colors.blue;
  const borderColor = hasError ? colors.red : `#c7c7c7`;

  let container: ViewStyle = {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor
  };

  let inner: ViewStyle = {
    width: '100%',
    paddingVertical: (height - fontSize) / 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'transparent',
    paddingLeft: 10,
    paddingRight: 10
  };

  if (focused) {
    container = {
      ...container,
      ...shadow(5, { shadowColor: color }),
      borderColor: lighten(color, 40)
    };

    inner = { ...inner, borderColor: color };
  }

  return StyleSheet.create({
    container,
    inner,
    input: {
      fontSize
    }
  });
};

export function TextInput({ onChange, hasError, ...props }: TextInputProps) {
  const [focused, setFocused] = useState(false);
  const [styles, setStyles] = useState(() => getStyles());
  const { onFocus, onBlur } = useMemo<TextInputProps>(() => {
    return {
      onFocus: () => setFocused(true),
      onBlur: () => setFocused(false)
    };
  }, []);

  useEffect(() => {
    setStyles(getStyles({ focused, hasError }));
  }, [hasError, focused]);

  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        <RNTextInput
          autoCapitalize="none"
          style={styles.input}
          onChangeText={onChange}
          {...{ onFocus, onBlur }}
          {...props}
        />
      </View>
    </View>
  );
}
