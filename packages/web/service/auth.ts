import type {
  Param$Login,
  Param$CreateUser,
  Param$DeleteAccount,
  Param$ModifyPassword,
  Schema$Authenticated,
  Schema$User
} from '@fullstack/server/dist/typings';
import { routes } from '@fullstack/server/dist/constants';
import { api } from './api';

export const login = (params: Param$Login) =>
  api.post<Schema$Authenticated>(routes.login, params);

export const refreshToken = () =>
  api.post<Schema$Authenticated>(routes.refresh_token);

export const registration = (params: Param$CreateUser) =>
  api.post<Schema$User>(routes.registration, params);

export const logout = () => api.post<void>(routes.logout);

export const deleteAccount = (data: Param$DeleteAccount) =>
  api.delete<void>(routes.delete_account, { data });

export const modifyPassword = (payload: Param$ModifyPassword) =>
  api.patch<unknown>(routes.modify_password, payload);
