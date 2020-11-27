import React, {
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef
} from 'react';
import router from 'next/router';
import { createSessionStorage } from '@/utils/storage';

interface Props {
  children?: ReactNode;
}

interface GoBackOptions {
  fallback?: string;
}

type GoBack = (options?: GoBackOptions) => Promise<void>;

const ActionContext = React.createContext<GoBack | undefined>(undefined);

const previousUrls = createSessionStorage<string[]>('previous_urls', []);

export function useHistoryBack() {
  const context = useContext(ActionContext);
  if (context === undefined) {
    throw new Error('useHistoryActions must be used within a HistoryProvider');
  }
  return context;
}

export function HistoryBackProvider({ children }: Props) {
  const records = useRef(previousUrls.get());
  const goBack = useCallback(async (options?: GoBackOptions) => {
    const previous = records.current.slice(-1)[0];
    if (previous) {
      router.back();
    } else if (options?.fallback) {
      await router.replace(options.fallback);
    }
    records.current.pop();
  }, []);

  useEffect(() => {
    const handler = (url: string) => {
      records.current = [...records.current.slice(-5), url];
    };
    router.events.on('routeChangeComplete', handler);
    return () => router.events.off('routeChangeComplete', handler);
  }, []);

  return React.createElement(
    ActionContext.Provider,
    { value: goBack },
    children
  );
}
