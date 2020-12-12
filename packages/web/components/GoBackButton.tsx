import React from 'react';
import { useGoBack, GoBackOptions } from '@/hooks/useGoBack';
import { ButtonPopover, ButtonPopoverProps } from './ButtonPopover';

interface GoBackButtonProps extends ButtonPopoverProps, GoBackOptions {}

export function GoBackButton({ targetPath, ...props }: GoBackButtonProps) {
  const goBack = useGoBack();
  return (
    <ButtonPopover
      {...props}
      minimal
      icon="arrow-left"
      content="返回"
      onClick={() => goBack({ targetPath })}
    />
  );
}
