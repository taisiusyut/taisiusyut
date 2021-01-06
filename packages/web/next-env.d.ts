/// <reference types="next" />
/// <reference types="next/types/global" />

declare module '*.css';

type Theme = 'light' | 'dark';
type AccentColor = 'red' | 'blue' | 'amber' | 'green' | 'purple' | 'grey';

declare interface Window {
  requestIdleCallback?: any;
  cancelIdleCallback?: any;

  // defeind in ./public/preload.js
  __setTheme: (theme: Theme) => void;
  __setAccentColor: (theme: AccentColor) => void;
  __setFixWidth: (flag: boolean) => void;
  __setPagingDisplay: (flag: boolean) => void;
}

// for `styled-jsx` width `@types/react@^17.0.0`
declare namespace React {
  interface StyleHTMLAttributes<T> extends HTMLAttributes<T> {
    jsx?: boolean;
    global?: boolean;
  }
}
