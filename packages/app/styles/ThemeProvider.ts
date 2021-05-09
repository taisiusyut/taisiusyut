import React, { ReactNode, useContext, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { darkTheme, lightTheme, Theme } from './theme';

type NamedStyles<T> = StyleSheet.NamedStyles<T>;

type ThemeAction = (theme: 'dark' | 'light') => void;

const StateContext = React.createContext<Theme | undefined>(undefined);
const ActionContext = React.createContext<ThemeAction | undefined>(undefined);

export function useTheme() {
  const context = useContext(StateContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export function makeStyles<T extends NamedStyles<T> | NamedStyles<any>>(
  handler: (theme: Theme) => T
) {
  function useStyles() {
    const theme = useTheme();
    return useMemo(() => handler(theme), [theme]);
  }
  return useStyles;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useColorScheme();

  return React.createElement(
    ActionContext.Provider,
    { value: () => void 0 },
    React.createElement(
      StateContext.Provider,
      { value: theme === 'dark' ? darkTheme : lightTheme },
      children
    )
  );
}
