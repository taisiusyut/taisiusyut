import React from 'react';
import { Button, IButtonProps } from '@blueprintjs/core';
import { useBoolean } from '@/hooks/useBoolean';

export function DangerButton(props: IButtonProps) {
  const [hover, on, off] = useBoolean();
  return (
    <Button
      intent={hover ? 'danger' : 'none'}
      onMouseEnter={on}
      onMouseLeave={off}
      {...props}
    />
  );
}
