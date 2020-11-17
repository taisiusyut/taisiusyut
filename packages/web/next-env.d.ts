/// <reference types="next" />
/// <reference types="next/types/global" />

type Theme = 'light' | 'dark';

declare interface Window {
  __setTheme: (theme: Theme) => void;
}
