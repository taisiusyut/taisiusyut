import type {
  Param$CreateUser,
  Param$UpdateUser,
  Param$GetUsers,
  Schema$User,
  PaginateResult
} from '@/typings';
import { routes } from '@/constants';
import { api } from './api';

export const createUser = (payload: Param$CreateUser) =>
  api.post<Schema$User>(routes.create_user, payload);

export const updateUser = ({ id, ...payload }: Param$UpdateUser) =>
  api.patch<Schema$User>(routes.update_user.generatePath({ id }), payload);

export const deleteUser = ({ id }: { id: string }) =>
  api.delete<Schema$User>(routes.delete_user.generatePath({ id }));

export const getUsers = (params?: Param$GetUsers) =>
  api.get<PaginateResult<Schema$User>>(routes.create_user, { params });
