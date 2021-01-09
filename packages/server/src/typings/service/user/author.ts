import { UserRole, Param$UpdateClient } from './';
import { Schema$Client, Param$CreateClient } from './client';

export interface Schema$Author extends Omit<Schema$Client, 'role'> {
  role: UserRole;
  description: string;
  wordCount: number;
}

export interface Param$CreateAuthor extends Omit<Param$CreateClient, 'role'> {
  role: UserRole;
  description?: string;
}

export interface Param$UpdateAuthor extends Omit<Param$UpdateClient, 'role'> {
  role?: UserRole;
  description?: string;
}
