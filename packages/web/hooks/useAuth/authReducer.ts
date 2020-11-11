import { Reducer } from 'react';
import {
  JWTSignPayload,
  Schema$User,
  UserRole
} from '@/typings';

export type LoginStatus = 'unknown' | 'loading' | 'loggedIn' | 'required';

export interface LoggedIn {
  loginStatus: 'loggedIn';
  user: JWTSignPayload & Partial<Schema$User>;
}

export interface NotLoggedIn {
  loginStatus: Exclude<LoginStatus, LoggedIn['loginStatus']>;
  user: null;
}

export type State = (LoggedIn | NotLoggedIn) & {
  isAdmin: boolean;
};

export type Actions =
  | { type: 'AUTHENTICATE' }
  | { type: 'AUTHENTICATE_SUCCESS'; payload: LoggedIn['user'] }
  | { type: 'AUTHENTICATE_FAILURE' }
  | { type: 'LOGOUT' }
  | { type: 'PROFILE_UPDATE'; payload: Partial<Schema$User> };

export interface LogoutOptions {
  slient?: boolean;
}

export const initialState: State = {
  loginStatus: 'unknown',
  user: null,
  isAdmin: false
};

export const authReducer: Reducer<State, Actions> = (prevState, action) => {
  switch (action.type) {
    case 'AUTHENTICATE':
      return {
        ...prevState,
        user: null,
        loginStatus: 'loading'
      };
    case 'AUTHENTICATE_SUCCESS':
      return {
        ...prevState,
        isAdmin: [UserRole.Root, UserRole.Admin].includes(action.payload.role),
        user: action.payload,
        loginStatus: 'loggedIn'
      };
    case 'AUTHENTICATE_FAILURE':
    case 'LOGOUT':
      return {
        ...prevState,
        user: null,
        loginStatus: 'required'
      };
    case 'PROFILE_UPDATE':
      return {
        ...prevState,
        loginStatus: 'loggedIn',
        user: {
          ...prevState.user,
          ...action.payload
        } as LoggedIn['user']
      };

    default:
      throw new Error('Incorrect action');
  }
};
