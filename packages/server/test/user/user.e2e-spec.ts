import { testCreateUser } from './create-user';
import { testUpdateUser } from './update-user';
import { testGetUsers } from './get-users';

describe('UserController (e2e)', () => {
  describe('(POST) Create User', testCreateUser);
  describe('(PTCH) Update User', testUpdateUser);
  describe('(GET)  Get Users', testGetUsers);
});
