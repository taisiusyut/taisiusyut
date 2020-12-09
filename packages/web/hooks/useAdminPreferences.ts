import React, { ReactNode, useMemo, useState, useContext } from 'react';
import { createAdminStorage } from '@/utils/storage';

interface Props {
  children: ReactNode;
}

export interface Preferences {
  theme: Theme;
  accentColor: AccentColor;
}

interface PreferencesActions {
  update: (payload: Partial<Preferences>) => void;
}

export const preferencesStorage = createAdminStorage<Preferences>(
  'preferences',
  { theme: 'light', accentColor: 'blue' }
);

const StateContext = React.createContext<Preferences | undefined>(undefined);
const ActionContext = React.createContext<PreferencesActions | undefined>(
  undefined
);

export function usePreferencesState() {
  const context = useContext(StateContext);
  if (context === undefined) {
    throw new Error(
      'usePreferencesState must be used within a AdminPreferencesProvider'
    );
  }
  return context;
}

export function usePreferencesActions() {
  const context = useContext(ActionContext);
  if (context === undefined) {
    throw new Error(
      'usePreferencesActions must be used within a AdminPreferencesProvider'
    );
  }
  return context;
}

export function useAdminPreferences() {
  return [usePreferencesState(), usePreferencesActions()] as const;
}

export function AdminPreferencesProvider({ children }: Props) {
  const [preferences, udpatePreferences] = useState(preferencesStorage.get());
  const actions = useMemo<PreferencesActions>(
    () => ({
      update: changes =>
        udpatePreferences(curr => {
          const preferences = { ...curr, ...changes };

          if (changes.theme) {
            window.__setTheme(changes.theme);
          }

          if (changes.accentColor) {
            window.__setAccentColor(changes.accentColor);
          }

          return preferences;
        })
    }),
    []
  );

  return React.createElement(
    ActionContext.Provider,
    { value: actions },
    React.createElement(StateContext.Provider, { value: preferences }, children)
  );
}
