import React, { useState } from 'react';
import { Button } from '@blueprintjs/core';
import { Input, InputProps } from './Input';

interface PasswordProps extends InputProps {
  visible?: boolean;
}

const disablePasting = (event: React.ClipboardEvent) => event.preventDefault();

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
      autoComplete={autoComplete}
      className={`password ${className}`.trim()}
      type={isVisible ? '' : 'password'}
      onPaste={disablePasting}
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
