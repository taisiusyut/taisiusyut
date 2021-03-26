import React, {
  ReactNode,
  useMemo,
  useState,
  useContext,
  useEffect
} from 'react';
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

const defaultPreferences: Preferences = { theme: 'dark', accentColor: 'blue' };

export const adminPreferencesStorage = createAdminStorage<Preferences>(
  'preferences',
  defaultPreferences
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
  const [state, setState] = useState(defaultPreferences);
  const actions = useMemo<PreferencesActions>(
    () => ({
      update: changes =>
        setState(curr => {
          const preferences = { ...curr, ...changes };

          if (changes.theme) {
            window.__setTheme(changes.theme);
          }

          if (changes.accentColor) {
            window.__setAccentColor(changes.accentColor);
          }

          adminPreferencesStorage.save(preferences);

          return preferences;
        })
    }),
    []
  );

  useEffect(() => {
    const theme = document.documentElement.getAttribute('data-theme') as Theme;
    const storage = adminPreferencesStorage.get();
    setState({ ...storage, theme });
  }, []);

  return React.createElement(
    ActionContext.Provider,
    { value: actions },
    React.createElement(StateContext.Provider, { value: state }, children)
  );
}
