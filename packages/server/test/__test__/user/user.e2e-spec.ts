import { testCreateUser } from './create-user';
import { testUpdateUser } from './update-user';
import { testDeleteUser } from './delete-user';
import { testGetUsers } from './get-users';
import { testGetUser } from './get-user';

describe('UserController (e2e)', () => {
  describe('(POST) Create User', testCreateUser);
  describe('(PTCH) Update User', testUpdateUser);
  describe('(DEL)  Delete User', testDeleteUser);
  describe('(GET)  Get Users', testGetUsers);
  describe('(GET)  Get User', testGetUser);
});
