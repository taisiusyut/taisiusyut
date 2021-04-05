import React from 'react';
import { TextInput, TextInputProps } from './Textinput';

export interface PasswordInputProps extends TextInputProps {
  visible?: boolean;
}

export function PasswordInput({ visible, ...props }: PasswordInputProps) {
  return <TextInput {...props}></TextInput>;
}
