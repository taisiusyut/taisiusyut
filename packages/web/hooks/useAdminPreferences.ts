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

export const adminPreferencesStorage = createAdminStorage<Preferences>(
  'preferences',
  { theme: 'light', accentColor: 'blue' }
);

const StateContext = React.createContext<Preferences | undefined>(undefined);
const ActionContext = React.createContext<PreferencesActions | undefined>(
  undefined
);

export function useAdminPreferencesState() {
  const context = useContext(StateContext);
  if (context === undefined) {
    throw new Error(
      'useAdminPreferencesState must be used within a AdminPreferencesProvider'
    );
  }
  return context;
}

export function useAdminPreferencesActions() {
  const context = useContext(ActionContext);
  if (context === undefined) {
    throw new Error(
      'useAdminPreferencesActions must be used within a AdminPreferencesProvider'
    );
  }
  return context;
}

export function useAdminPreferences() {
  return [useAdminPreferencesState(), useAdminPreferencesActions()] as const;
}

export function AdminPreferencesProvider({ children }: Props) {
  const [preferences, udpatePreferences] = useState(
    adminPreferencesStorage.get()
  );
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
