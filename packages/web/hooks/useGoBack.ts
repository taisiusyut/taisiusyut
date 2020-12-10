/**
 * Anims to preserve search params in previous url
 */

import React, {
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef
} from 'react';
import router from 'next/router';

interface Props {
  children?: ReactNode;
}

interface GoBackOptions {
  targetPath: string;
}

type GoBack = (options: GoBackOptions) => Promise<void>;

const ActionContext = React.createContext<GoBack | undefined>(undefined);

export function useGoBack() {
  const context = useContext(ActionContext);
  if (context === undefined) {
    throw new Error('useHistoryActions must be used within a HistoryProvider');
  }
  return context;
}

export function GoBackProvider({ children }: Props) {
  const records = useRef<string[]>([]);
  const goBack = useCallback<GoBack>(async options => {
    const previous = records.current[records.current.length - 2];
    if (previous && previous.replace(/\?.*/, '') === options.targetPath) {
      await router.push(previous);
    } else {
      await router.push(options.targetPath);
    }
    records.current = records.current.slice(0, -2);
  }, []);

  useEffect(() => {
    const handler = (url: string) => {
      const last = records.current.slice(-1)[0];
      const maxRecords = 5;
      const samePathname =
        !!last && last.replace(/\?.*/, '') === url.replace(/\?.*/, '');
      records.current = samePathname
        ? [...records.current.slice(-maxRecords, -1), url] // replace last path
        : [...records.current.slice(-maxRecords), url];
    };
    router.events.on('routeChangeComplete', handler);
    handler(window.location.pathname + window.location.search);
    return () => router.events.off('routeChangeComplete', handler);
  }, []);

  return React.createElement(
    ActionContext.Provider,
    { value: goBack },
    children
  );
}
