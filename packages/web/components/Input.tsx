import React, { ChangeEvent, useState } from 'react';
import {
  Button,
  InputGroup,
  TextArea as BpTextArea,
  NumericInput as BpNumericInput,
  ITextAreaProps,
  IInputGroupProps,
  INumericInputProps,
  HTMLInputProps,
  ControlGroup
} from '@blueprintjs/core';

interface InputProps
  extends IInputGroupProps,
    Omit<HTMLInputProps, 'value' | 'defaultValue' | 'onChange'> {}

interface PasswordProps extends InputProps {
  visible?: boolean;
}

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

export function NumericInput({
  onValueChange,
  onChange,
  ...props
}: INumericInputProps & {
  onChange?: (payload: number | string) => void;
} = {}) {
  return (
    <BpNumericInput
      fill
      clampValueOnBlur
      autoComplete="off"
      allowNumericCharactersOnly={false}
      {...props}
      {...(props &&
        onChange &&
        typeof props.value === 'undefined' && { value: '' })}
      onValueChange={(num, raw) => onChange && onChange(isNaN(num) ? raw : num)}
    />
  );
}

export function Password({
  className = '',
  visible = false,
  autoComplete,
  ...props
}: PasswordProps) {
  const [isVisible, setVisible] = useState(visible);
  return (
    <Input
      {...props}
      autoComplete={autoComplete === 'off' ? 'new-password' : autoComplete}
      className={`password ${className}`.trim()}
      type={isVisible ? '' : 'password'}
      rightElement={
        <Button
          minimal
          icon={isVisible ? 'eye-off' : 'eye-open'}
          onClick={() => setVisible(visible => !visible)}
        />
      }
    />
  );
}

type Range = [string?, string?];
interface RangeControl {
  value?: Range;
  onChange?: (payload: Range) => void;
}
export function NumericRangeInput({
  value,
  onChange,
  ...props
}: IInputGroupProps & RangeControl) {
  const values = value || [];
  const handleChange = onChange || (() => void 0);
  return (
    <ControlGroup className="numeric-range-input">
      <Input
        {...props}
        placeholder="Greater than"
        value={values[0]}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          handleChange([event.target.value, values[1]])
        }
      />
      <Input
        {...props}
        placeholder="Less than"
        value={values[1]}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          handleChange([values[0], event.target.value])
        }
      />
    </ControlGroup>
  );
}
