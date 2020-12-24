import React from 'react';
import { Button } from '@blueprintjs/core';
import { withBreakPoint } from '@/hooks/useBreakPoints';

export function BlankButton() {
  return <Button minimal icon="blank" style={{ visibility: 'hidden' }} />;
}

// cannot put at `ClientHeader.tsx` and import from 'xxxx/ClientLayout'
// possible be circular dependency
export function withDesktopHeaderBtn<P extends {}>(
  Component: React.ComponentType<P>
) {
  return withBreakPoint<P>(Component, {
    validate: breakPoint => breakPoint > 768,
    fallback: <BlankButton />
  });
}
