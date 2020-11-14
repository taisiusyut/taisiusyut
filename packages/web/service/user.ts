import type {
  Param$CreateUser,
  Param$GetUsers,
  Schema$User,
  PaginateResult
} from '@/typings';
import { routes } from '@/constants';
import { api } from './api';

export const createUser = (payload: Param$CreateUser) =>
  api.post<Schema$User>(routes.create_user, payload);

export const getUsers = (params?: Param$GetUsers) =>
  api.get<PaginateResult<Schema$User>>(routes.create_user, { params });
