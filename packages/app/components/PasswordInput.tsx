import React from 'react';
import { TextInput as RNTextInput } from 'react-native';
import { TextInput, TextInputProps } from './Textinput';

export interface PasswordInputProps extends TextInputProps {
  visible?: boolean;
}

export const PasswordInput = React.forwardRef<RNTextInput, PasswordInputProps>(
  ({ visible, ...props }, ref) => {
    return (
      <TextInput
        textContentType="password"
        secureTextEntry={!visible}
        ref={ref}
        {...props}
      />
    );
  }
);
