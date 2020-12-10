import React from 'react';
import { Button, IButtonProps } from '@blueprintjs/core';
import { useGoBack } from '@/hooks/useGoBack';

interface GoBackButtonProps extends IButtonProps {
  targetPath: string;
}

export function GoBackButton({ targetPath, ...props }: GoBackButtonProps) {
  const goBack = useGoBack();
  return (
    <Button
      {...props}
      minimal
      icon="arrow-left"
      onClick={() => goBack({ targetPath })}
    />
  );
}
