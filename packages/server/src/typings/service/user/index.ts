import { Timestamp, Pagination, Search, DateRange, Insertion } from '..';
import {
  Schema$Author,
  Param$CreateAuthor,
  Param$UpdateAuthor
} from './author';
import {
  Schema$Client,
  Param$CreateClient,
  Param$UpdateClient
} from './client';

export enum UserRole {
  Root = 'Root',
  Admin = 'Admin',
  Author = 'Author',
  Client = 'Client'
}

export interface BaseUser extends Timestamp {
  id: string;
  email: string;
  username: string;
  password: string;
  role: UserRole;
  nickname: string;
}

export interface Schema$Root extends BaseUser {
  role: UserRole.Root;
}

export interface Schema$Admin extends BaseUser {
  role: UserRole.Admin;
}

export type Schema$User =
  | Schema$Root
  | Schema$Admin
  | Schema$Client
  | Schema$Author;

export interface SharedCreateUser {
  email: string;
  username: string;
  password: string;
  role: UserRole;
}

export type Param$CreateUser =
  | SharedCreateUser
  | (Param$CreateClient | Param$CreateAuthor);

export interface SharedUpdateUser {
  id: string;
  email?: string;
  nickname?: string;
}

export type Param$UpdateUser =
  | SharedUpdateUser
  | Param$UpdateClient
  | Param$UpdateAuthor;

export type InsertedUserSchema = Insertion<Schema$User>;
export type InsertedCreateuser = Insertion<Param$CreateUser>;
export type InsertedUpdateuser = Insertion<Param$UpdateUser>;

export interface Param$GetUsers extends Pagination, Search {
  id?: string;
  username?: string;
  email?: string;
  role?: UserRole;
  createdAt?: DateRange;
  updatedAt?: DateRange;
  nickname?: string;
}

export * from './author';
export * from './client';
