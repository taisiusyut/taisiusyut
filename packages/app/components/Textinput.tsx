import React, { useMemo, useState } from 'react';
import {
  View,
  StyleSheet,
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  ViewStyle
} from 'react-native';
import { shadow, lighten, colors, useTheme, Theme } from '@/styles';
import { ControlProps } from '@/utils/form';

interface StylesOption {
  hasError?: boolean;
  focused?: boolean;
  theme: Theme;
}

export interface TextInputProps
  extends Omit<RNTextInputProps, 'onChange'>,
    ControlProps<string> {
  hasError?: boolean;
}

const height = 34;
const fontSize = 16;

const getStyles = ({ hasError, focused, theme }: StylesOption) => {
  const darkMode = theme.type === 'dark';
  const color = hasError ? colors.red : colors.blue;
  const borderColor = hasError ? colors.red : darkMode ? `#474747` : `#c7c7c7`;

  let container: ViewStyle = {
    flexDirection: 'row',
    backgroundColor: darkMode ? `#252525` : `#fff`,
    borderRadius: 5,
    borderWidth: 1,
    borderColor
  };

  let inner: ViewStyle = {
    flex: 1,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'transparent',
    paddingHorizontal: 10,
    paddingVertical: (height - fontSize) / 2
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
      fontSize,
      color: theme.text
    }
  });
};

export const TextInput = React.forwardRef<RNTextInput, TextInputProps>(
  ({ onChange, hasError, ...props }, ref) => {
    const [focused, setFocused] = useState(false);
    const { onFocus, onBlur } = useMemo<TextInputProps>(() => {
      return {
        onFocus: () => setFocused(true),
        onBlur: () => setFocused(false)
      };
    }, []);
    const theme = useTheme();
    const styles = useMemo(() => getStyles({ theme, focused, hasError }), [
      theme,
      focused,
      hasError
    ]);

    return (
      <View style={styles.container}>
        <View style={styles.inner}>
          <RNTextInput
            autoCapitalize="none"
            style={styles.input}
            onChangeText={onChange}
            ref={ref}
            {...{ onFocus, onBlur }}
            {...props}
          />
        </View>
      </View>
    );
  }
);
