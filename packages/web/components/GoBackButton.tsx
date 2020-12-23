import React from 'react';
import { useGoBack, GoBackOptions } from '@/hooks/useGoBack';
import { ButtonPopover, ButtonPopoverProps } from './ButtonPopover';

interface GoBackButtonProps extends ButtonPopoverProps, GoBackOptions {}

export function GoBackButton({
  targetPath,
  onClick,
  icon = 'arrow-left',
  content = '返回',
  ...props
}: GoBackButtonProps) {
  const { goBack } = useGoBack();
  return (
    <ButtonPopover
      {...props}
      minimal
      icon={icon}
      content={content}
      onClick={event => {
        goBack({ targetPath }).then(() => onClick && onClick(event));
      }}
    />
  );
}
