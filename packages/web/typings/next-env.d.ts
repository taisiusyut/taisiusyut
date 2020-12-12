/// <reference types="next" />
/// <reference types="next/types/global" />

declare module '*.css';

type Theme = 'light' | 'dark';
type AccentColor = 'red' | 'blue' | 'amber' | 'green' | 'purple' | 'grey';

declare interface Window {
  __setTheme: (theme: Theme) => void;
  __setAccentColor: (theme: AccentColor) => void;
  __setFixWidth: (flag: boolean) => void;
}
