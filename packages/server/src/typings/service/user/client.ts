import { BaseUser, UserRole, SharedCreateUser, SharedUpdateUser } from './';

export interface Schema$Client extends BaseUser {
  role: UserRole;
}

export interface Param$CreateClient extends SharedCreateUser {
  role: UserRole;
}

export interface Param$UpdateClient extends SharedUpdateUser {
  role?: UserRole;
}
