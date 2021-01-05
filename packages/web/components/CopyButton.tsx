import React, { useRef, useState } from 'react';
import { Button, IButtonProps } from '@blueprintjs/core';

export function CopyButton({ onClick, ...props }: IButtonProps) {
  const [copied, setCopied] = useState(false);
  const timeout = useRef(setTimeout(() => void 0, 0));

  return (
    <Button
      {...props}
      intent={copied ? 'success' : 'primary'}
      text={copied ? '已複製' : '複製'}
      style={{ minWidth: 60 }}
      disabled={typeof document === 'undefined' || !('execCommand' in document)}
      onClick={(event: React.MouseEvent<HTMLElement>) => {
        if (onClick) {
          onClick(event);
          clearTimeout(timeout.current);
          timeout.current = setTimeout(() => setCopied(false), 500);
          setCopied(true);
        }
      }}
    />
  );
}
