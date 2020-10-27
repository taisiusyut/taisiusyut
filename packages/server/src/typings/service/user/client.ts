import { BaseUser, UserRole, SharedCreateUser, SharedUpdateUser } from './';

export interface Schema$Client extends BaseUser {
  role: UserRole.Client;
  nickname?: string;
}

export interface Param$CreateClient extends SharedCreateUser {
  role: UserRole.Client;
  nickname?: string;
}

export interface Param$UpdateClient extends SharedUpdateUser {
  nickname?: string;
}
