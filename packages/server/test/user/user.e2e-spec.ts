import { testCreateUser } from './create-user';
import { testUpdateUser } from './update-user';

describe('UserController (e2e)', () => {
  describe('(POST) Create User', testCreateUser);
  describe('(POST) Update User', testUpdateUser);
});
