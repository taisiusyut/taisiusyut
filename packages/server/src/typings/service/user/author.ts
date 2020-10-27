import { UserRole, Param$UpdateClient } from './';
import { Schema$Client, Param$CreateClient } from './client';

export interface Schema$Author extends Omit<Schema$Client, 'role'> {
  role: UserRole.Author;
  description?: string;
}

export interface Param$CreateAuthor extends Omit<Param$CreateClient, 'role'> {
  role: UserRole.Author;
  description?: string;
}

export interface Param$UpdateAuthor extends Param$UpdateClient {
  description?: string;
}
