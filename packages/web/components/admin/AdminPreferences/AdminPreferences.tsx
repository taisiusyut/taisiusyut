import React, { ReactNode, useMemo, useState } from 'react';
import { createAdminStorage } from '@/utils/storage';

interface Props {
  children: ReactNode;
}

interface Preferences {
  theme: 'light' | 'dark';
}

interface PreferencesActions {
  update: (payload: Partial<Preferences>) => void;
}

export const preferencesStorage = createAdminStorage<Preferences>(
  'preferences',
  { theme: 'light' }
);

const StateContext = React.createContext<Preferences | undefined>(undefined);
const ActionsContext = React.createContext<PreferencesActions | undefined>(
  undefined
);

export function AdminPreferencesProvider({ children }: Props) {
  const [preferences, udpatePreferences] = useState(preferencesStorage.get());
  const actions = useMemo<PreferencesActions>(
    () => ({
      update: changes =>
        udpatePreferences(curr => {
          const preferences = { ...curr, ...changes };

          if (changes.theme) {
            //
          }

          return preferences;
        })
    }),
    []
  );

  return (
    <ActionsContext.Provider value={actions}>
      <StateContext.Provider value={preferences}>
        {children}
      </StateContext.Provider>
    </ActionsContext.Provider>
  );
}
