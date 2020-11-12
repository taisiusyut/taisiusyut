import type { Param$CreateUser, Schema$User } from '@/typings';
import { routes } from '@/constants';
import { api } from './api';

export const createUser = (payload: Param$CreateUser) =>
  api.post<Schema$User>(routes.create_user, payload);
