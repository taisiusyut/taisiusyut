import { testLoginLogout } from './login-logout';
import { testRegistration } from './registration';
import { testRefreshToken } from './refresh-token';
import { testDeleteAccount } from './delete-account';
import { testModifyPassword } from './modify-password';
import { testGetProfile } from './get-profile';
import { testUpdateProfile } from './update-profile';
import { testLoginRecords } from './login-records';
import { testJWT } from './jwt';

describe('AuthController (e2e)', () => {
  describe(`(POST) Login & Logout`, testLoginLogout);
  describe(`(POST) Registration`, testRegistration);
  describe('(POST) Refresh Token', testRefreshToken);
  describe(`(POST) Delete Account`, testDeleteAccount);
  describe(`(PTCH) Modify Password`, testModifyPassword);
  describe(`(GET)  Get Profile`, testGetProfile);
  describe(`(PTCH) Update Profile`, testUpdateProfile);
  describe(`Login Records`, testLoginRecords);
  describe('JWT', testJWT);
});
