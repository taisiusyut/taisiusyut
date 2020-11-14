import React from 'react';
import {
  InputGroup,
  TextArea as BpTextArea,
  ITextAreaProps,
  IInputGroupProps,
  HTMLInputProps
} from '@blueprintjs/core';

export interface InputProps
  extends IInputGroupProps,
    Omit<HTMLInputProps, 'value' | 'defaultValue' | 'onChange'> {}

export function Input(props?: InputProps) {
  return (
    <InputGroup
      fill
      autoComplete="off"
      {...props}
      {...(props &&
        props.onChange &&
        typeof props.value === 'undefined' && { value: '' })}
    />
  );
}

export function TextArea(props?: ITextAreaProps) {
  return (
    <BpTextArea
      fill
      autoComplete="off"
      {...props}
      {...(props &&
        props.onChange &&
        typeof props.value === 'undefined' && { value: '' })}
    />
  );
}
