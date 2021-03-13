import { testCreateUser } from './create-user';
import { testUpdateUser } from './update-user';
import { testDeleteUser } from './delete-user';
import { testGetUsers } from './get-users';
import { testGetUser } from './get-user';
import { testAuthorRequest } from './author-request';

describe('UserController (e2e)', () => {
  describe('(POST) Create User', testCreateUser);
  describe('(PATCH) Update User', testUpdateUser);
  describe('(DEL) Delete User', testDeleteUser);
  describe('(GET) Get Users', testGetUsers);
  describe('(GET) Get User', testGetUser);
  describe('(POST) Author Request', testAuthorRequest);
});
