import type {
  Param$Login,
  Param$CreateUser,
  Param$DeleteAccount,
  Param$ModifyPassword,
  Param$UpdateUser,
  Schema$Authenticated,
  Schema$User,
  Schema$LoginRecord
} from '@/typings';
import { routes } from './routes';
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

export const getProfile = () => api.get<Schema$User>(routes.profile);

export const updateProfile = (payload: Param$UpdateUser) =>
  api.patch<Schema$User>(routes.profile, payload);

export const getLoginRecords = () =>
  api.get<Schema$LoginRecord[]>(routes.get_login_records);

export const logoutOthers = () => api.post<void>(routes.logout_others);
