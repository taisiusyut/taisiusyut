import React from 'react';
import { Button } from '@blueprintjs/core';
import { Control } from '@/utils/form';
import { Input, InputProps } from './Input';

interface Props
  extends Omit<InputProps, 'value' | 'onChange'>,
    Control<string> {
  onClear?: () => void;
}

export function SearchInput({ value, onChange, onClear, ...props }: Props) {
  return (
    <Input
      placeholder="Search ..."
      {...props}
      value={value}
      onChange={onChange as any}
      rightElement={
        value ? (
          <Button
            minimal
            icon="cross"
            onClick={() => {
              onChange && onChange('');
              onClear && onClear();
            }}
          />
        ) : undefined
      }
    />
  );
}
