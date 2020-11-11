import React, { ReactNode } from 'react';
import { defer, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import {
  Param$Login,
  Param$CreateUser,
  Schema$User
} from '@fullstack/server/dist/typings';
import { clearJwtToken } from '@/service';
import { logout, registration, getJwtToken$ } from '@/service';
import { Toaster } from '@/utils/toaster';
import { State, LogoutOptions, authReducer, initialState } from './authReducer';

type AuthenticatePayload = Param$Login | Param$CreateUser;

export type AuthActions = {
  logout: (options?: LogoutOptions) => void;
  authenticate: (payload?: AuthenticatePayload) => void;
  updateProfile: (payload: Partial<Schema$User>) => void;
};

export const StateContext = React.createContext<State | undefined>(undefined);
export const ActionContext = React.createContext<AuthActions | undefined>(
  undefined
);

const authenticate$ = (payload?: AuthenticatePayload) =>
  payload && 'email' in payload
    ? defer(() => registration(payload)).pipe(
        switchMap(() => {
          Toaster.success({ message: 'Registration Success' });
          return getJwtToken$(payload);
        }),
        catchError(error => {
          Toaster.apiError('Registration failure', error);
          return throwError(error);
        })
      )
    : getJwtToken$(payload).pipe(
        catchError(error => {
          const isLogin = !!payload;
          isLogin && Toaster.apiError('Login failure', error);
          return throwError(error);
        })
      );

export function AuthProvider({ children }: { children?: ReactNode }) {
  const [state, dispatch] = React.useReducer(authReducer, initialState);

  const authActions = React.useMemo<AuthActions>(() => {
    return {
      updateProfile: payload => dispatch({ type: 'PROFILE_UPDATE', payload }),
      logout: async options => {
        try {
          await logout();
          if (options?.slient !== true) {
            Toaster.success({ message: 'Logout success' });
          }
          clearJwtToken();
          dispatch({ type: 'LOGOUT' });
        } catch (error) {
          Toaster.apiError('Logout failure', error);
        }
      },
      authenticate: payload => {
        dispatch({ type: 'AUTHENTICATE' });
        authenticate$(payload).subscribe(
          ({ user }) => {
            dispatch({ type: 'AUTHENTICATE_SUCCESS', payload: user });
          },
          () => dispatch({ type: 'AUTHENTICATE_FAILURE' })
        );
      }
    };
  }, []);

  return React.createElement(
    StateContext.Provider,
    { value: state },
    React.createElement(
      ActionContext.Provider,
      { value: authActions },
      children
    )
  );
}
