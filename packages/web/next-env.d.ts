/// <reference types="next" />
/// <reference types="next/types/global" />
/// <reference types="@mdx-js/loader" />

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

declare module '*.md' {
  let MDXComponent: (props) => JSX.Element;
  export default MDXComponent;
}
