import React, { useContext, useEffect, useMemo, useRef } from 'react';
import router from 'next/router';
import { match } from 'path-to-regexp';
import { createSessionStorage } from '@/utils/storage';

interface Props {
  children?: React.ReactNode;
}

export interface GoBackOptions {
  targetPath?: string | string[];
}

type GoBack = (options: GoBackOptions) => Promise<void>;
type SetRecords = (handler: (records: string[]) => string[]) => void;

const goBackStorage = createSessionStorage<string[]>('goBackRecords', []);

export interface GoBackActions {
  goBack: GoBack;
  setRecords: SetRecords;
}

const ActionContext = React.createContext<GoBackActions | undefined>(undefined);

export function useGoBack() {
  const context = useContext(ActionContext);
  if (context === undefined) {
    throw new Error('useGoBack must be used within a GoBackProvider');
  }
  return context;
}

const isMatchUrl = (target: string, url: string) => {
  const matches = match(target, {});
  return !!matches(url, { decode: decodeURIComponent });
};

export function GoBackProvider({ children }: Props) {
  const records = useRef<string[]>([]);
  const actions = useMemo<GoBackActions>(() => {
    return {
      goBack: async ({ targetPath = [] }) => {
        const previous = records.current[records.current.length - 2];
        const targetPaths = Array.isArray(targetPath)
          ? targetPath
          : [targetPath];

        if (
          previous &&
          (targetPaths.length === 0 ||
            targetPaths.some(path =>
              isMatchUrl(path, decodeURIComponent(previous).replace(/\?.*/, ''))
            ))
        ) {
          await router.push(previous);
        } else {
          // filter out dynamic route format
          const fallback = targetPaths.find(p => p.indexOf(':') === -1) || '/';
          await router.push(fallback);
        }

        records.current = records.current.slice(0, -2);
      },
      setRecords: handler => {
        records.current = handler(records.current);
      }
    };
  }, []);

  useEffect(() => {
    records.current = goBackStorage.get();

    const handler = () => {
      goBackStorage.save(records.current);
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, []);

  useEffect(() => {
    const handler = (url: string) => {
      // Note:
      // should not return/skip if shallow is false,
      // because the purpose of this function is to preserve search params
      // but update search params always set shallow to true
      const last = records.current.slice(-1)[0];
      const maxRecords = 5;
      const samePathname =
        !!last && last.replace(/\?.*/, '') === url.replace(/\?.*/, '');
      records.current = samePathname
        ? [...records.current.slice(-maxRecords, -1), url] // replace last path
        : [...records.current.slice(-maxRecords), url];
    };
    router.events.on('routeChangeComplete', handler);
    return () => router.events.off('routeChangeComplete', handler);
  }, []);

  return React.createElement(
    ActionContext.Provider,
    { value: actions },
    children
  );
}
