import React, { ReactNode, useEffect } from 'react';
import { defer, fromEvent, Observable, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import {
  Param$Login,
  Param$CreateUser,
  Schema$User,
  Schema$Authenticated
} from '@/typings';
import { clearJwtToken, logout, registration, getJwtToken } from '@/service';
import { Toaster } from '@/utils/toaster';
import {
  AuthState,
  LogoutOptions,
  authReducer,
  initialState
} from './authReducer';

type AuthenticatePayload = Param$Login | Param$CreateUser;

export type AuthActions = {
  logout: (options?: LogoutOptions) => void;
  authenticate: (
    payload?: AuthenticatePayload
  ) => Observable<Schema$Authenticated>;
  updateProfile: (payload: Partial<Schema$User>) => void;
};

export const StateContext = React.createContext<AuthState | undefined>(
  undefined
);
export const ActionContext = React.createContext<AuthActions | undefined>(
  undefined
);

const LOGGED_IN = 'LOGGED_IN';

const shouldRefershToken = () => {
  try {
    return !!localStorage.getItem(LOGGED_IN);
  } catch (error) {}
  return false;
};

function authenticate$(
  payload?: AuthenticatePayload
): Observable<Schema$Authenticated> {
  if (payload && 'email' in payload) {
    return defer(() => registration(payload)).pipe(
      switchMap(() => {
        Toaster.success({ message: 'Registration Success' });
        const { username, password } = payload;
        return authenticate$({ username, password });
      }),
      catchError(error => {
        Toaster.apiError('Registration failure', error);
        return throwError(error);
      })
    );
  }

  // handle for login / referesh-token
  const isLogin = !!payload;
  return defer(() => getJwtToken(payload)).pipe(
    catchError(error => {
      isLogin && Toaster.apiError('Login failure', error);
      return throwError(error);
    })
  );
}

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

          try {
            localStorage.removeItem(LOGGED_IN);
          } catch {}
        } catch (error) {
          Toaster.apiError('Logout failure', error);
        }
      },
      authenticate: payload => {
        dispatch({ type: 'AUTHENTICATE' });

        return authenticate$(payload).pipe(
          tap(auth => {
            try {
              localStorage.setItem(LOGGED_IN, String(+new Date()));
            } catch {}

            window.dataLayer.push({
              user_id: auth.user.user_id
            });

            dispatch({ type: 'AUTHENTICATE_SUCCESS', payload: auth.user });
          }),
          catchError(error => {
            dispatch({ type: 'AUTHENTICATE_FAILURE' });
            return throwError(error);
          })
        );
      }
    };
  }, []);

  useEffect(() => {
    if (shouldRefershToken()) {
      const subscription = authActions.authenticate().subscribe(
        () => void 0,
        () => {
          if (process.env.NODE_ENV === 'production') {
            // eslint-disable-next-line
            console.clear();
          }
        }
      );
      return () => subscription.unsubscribe();
    } else {
      // set loginStatus to 'required'
      dispatch({ type: 'AUTHENTICATE_FAILURE' });
    }
  }, [authActions]);

  useEffect(() => {
    // logout current page when user is logout at other tab/page or clear all storage
    const subscription = fromEvent<StorageEvent>(window, 'storage').subscribe(
      event => {
        if (event.key === LOGGED_IN && event.newValue === null) {
          authActions.logout({ slient: true });
        }
      }
    );
    return () => subscription.unsubscribe();
  }, [authActions]);

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
