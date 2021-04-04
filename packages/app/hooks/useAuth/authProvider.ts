import React, { useEffect } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { defer, fromEvent, Observable, throwError } from 'rxjs';
import { catchError, switchMap, mergeMap } from 'rxjs/operators';
import {
  Param$Login,
  Param$CreateUser,
  Schema$User,
  Schema$Authenticated
} from '@/typings';
import { clearJwtToken, logout, registration, getJwtToken } from '@/service';
import {
  AuthState,
  LogoutOptions,
  authReducer,
  initialState
} from './authReducer';
import { getErrorMessage } from '@/../common/service';

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

const shouldRefershToken = async () => {
  try {
    return !!(await AsyncStorage.getItem(LOGGED_IN));
  } catch (error) {}
  return false;
};

function authenticate$(
  payload?: AuthenticatePayload
): Observable<Schema$Authenticated> {
  if (payload && 'email' in payload) {
    return defer(() => registration(payload)).pipe(
      switchMap(() => {
        // Alert.alert.success({ message: 'Registration Success' });
        const { username, password } = payload;
        return authenticate$({ username, password });
      }),
      catchError(error => {
        Alert.alert('Registration failure', getErrorMessage(error));
        return throwError(error);
      })
    );
  }

  // handle for login / referesh-token
  const isLogin = !!payload;
  return defer(() => getJwtToken(payload)).pipe(
    catchError(error => {
      isLogin && Alert.alert('Login failure', getErrorMessage(error));
      return throwError(error);
    })
  );
}

export function AuthProvider({ children }: { children?: React.ReactNode }) {
  const [state, dispatch] = React.useReducer(authReducer, initialState);

  const authActions = React.useMemo<AuthActions>(() => {
    return {
      updateProfile: payload => dispatch({ type: 'PROFILE_UPDATE', payload }),
      logout: async options => {
        try {
          await logout();
          if (options?.slient !== true) {
            // Toaster.success({ message: 'Logout success' });
          }
          clearJwtToken();

          // lastVisitStorage.clear();

          dispatch({ type: 'LOGOUT' });

          try {
            await AsyncStorage.removeItem(LOGGED_IN);
          } catch {}
        } catch (error) {
          Alert.alert('Login failure', getErrorMessage(error));
        }
      },
      authenticate: payload => {
        dispatch({ type: 'AUTHENTICATE' });

        return authenticate$(payload).pipe(
          mergeMap(async auth => {
            try {
              await AsyncStorage.setItem(LOGGED_IN, String(+new Date()));
            } catch {}

            dispatch({ type: 'AUTHENTICATE_SUCCESS', payload: auth.user });

            return auth;
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
          try {
            AsyncStorage.removeItem(LOGGED_IN);
          } catch {}
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
