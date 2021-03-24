import React, { useContext } from 'react';
import { Schema$BugReport } from '@/typings';
import { ProviderProps } from '@/utils/composeProviders';
import {
  CRUDActionCreators,
  CRUDState,
  Dispatched,
  DefaultCRUDActionTypes,
  createUseCRUDReducer
} from '@/hooks/crud-reducer';

export type BugReport = (Schema$BugReport | Partial<Schema$BugReport>) & {
  id: string;
};

export type BugReportState = CRUDState<BugReport, true>;
export type BugReportActions = Dispatched<CRUDActionCreators<BugReport, 'id'>>;

export const StateContext = React.createContext<BugReportState | undefined>(
  undefined
);
export const ActionContext = React.createContext<BugReportActions | undefined>(
  undefined
);

const pageSize = 10;
export const placeholder = Array.from<unknown, BugReport>(
  { length: pageSize },
  (_, idx) => ({ id: String(idx) })
);

const useCRUDReducer = createUseCRUDReducer<BugReport, 'id'>('id', {
  initializer: (state, reducer) =>
    reducer(state, { type: DefaultCRUDActionTypes.LIST, payload: placeholder })
});

export function ClientReportProvider({ children }: ProviderProps) {
  const [state, actions] = useCRUDReducer();

  return React.createElement(
    StateContext.Provider,
    { value: state },
    React.createElement(ActionContext.Provider, { value: actions }, children)
  );
}

export function useClientReportState() {
  const context = useContext(StateContext);
  if (context === undefined) {
    throw new Error(
      'useClientReportState must be used within a ClientReportProvider'
    );
  }
  return context;
}

export function useClientReportActions() {
  const context = useContext(ActionContext);
  if (context === undefined) {
    throw new Error(
      'useClientReportActions must be used within a ClientReportProvider'
    );
  }
  return context;
}

export function useClientReports() {
  return [useClientReportState(), useClientReportActions()] as const;
}
