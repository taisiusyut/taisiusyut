import { loginAsDefaultRoot } from '../service/auth';
import { testCreateUser } from './create-user';

describe('UserController (e2e)', () => {
  beforeAll(async () => {
    root = await loginAsDefaultRoot().then(res => res.body);
  });

  describe('(POST) Create User', testCreateUser);
});
