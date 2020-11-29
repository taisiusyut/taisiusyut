import React, { ChangeEvent, useState } from 'react';
import { Button } from '@blueprintjs/core';
import { Control } from '@/utils/form';
import { Input, InputProps } from './Input';

interface Props
  extends Omit<InputProps, 'value' | 'onChange'>,
    Control<string> {
  onClear?: () => void;
}

export function SearchInput({
  value: controled,
  onChange,
  onClear,
  ...props
}: Props) {
  const [local, setLocalValue] = useState('');
  const value = controled || local;
  const handleChange = onChange || setLocalValue;

  return (
    <Input
      placeholder="Search ..."
      {...props}
      value={value}
      onChange={(event: ChangeEvent<HTMLInputElement>) =>
        handleChange(event.target.value)
      }
      rightElement={
        value ? (
          <Button
            minimal
            icon="cross"
            onClick={() => {
              handleChange('');
              onClear && onClear();
            }}
          />
        ) : undefined
      }
    />
  );
}
