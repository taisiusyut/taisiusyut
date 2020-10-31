import { testCreateUser } from './create-user';
import { testUpdateUser } from './update-user';
import { testGetUsers } from './get-users';
import { testDeleteUser } from './delete-user';

describe('UserController (e2e)', () => {
  describe('(POST) Create User', testCreateUser);
  describe('(PTCH) Update User', testUpdateUser);
  describe('(DEL)  Delete User', testDeleteUser);
  describe('(GET)  Get Users', testGetUsers);
});
