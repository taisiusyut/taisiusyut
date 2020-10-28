import { BaseUser, UserRole, SharedCreateUser, SharedUpdateUser } from './';

export interface Schema$Client extends BaseUser {
  role: UserRole.Client;
}

export interface Param$CreateClient extends SharedCreateUser {
  role: UserRole.Client;
}

export interface Param$UpdateClient extends SharedUpdateUser {}
