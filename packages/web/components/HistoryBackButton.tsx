import React from 'react';
import { Button, IButtonProps } from '@blueprintjs/core';
import { useHistoryBack } from '@/hooks/useHistoryBack';

interface HistoryBackButtonProps extends IButtonProps {
  fallbackURL?: string;
}

export function HistoryBackButton({
  fallbackURL,
  ...props
}: HistoryBackButtonProps) {
  const goBack = useHistoryBack();
  return (
    <Button
      {...props}
      minimal
      icon="arrow-left"
      onClick={() => goBack({ fallback: fallbackURL })}
    />
  );
}
