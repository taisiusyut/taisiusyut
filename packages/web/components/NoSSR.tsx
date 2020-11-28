import { ReactNode } from 'react';
import dynamic from 'next/dynamic';

export const NoSSR = dynamic<{ children: ReactNode }>(
  async () =>
    function NoSSR({ children }) {
      return <>{children}</>;
    },
  { ssr: false }
);
