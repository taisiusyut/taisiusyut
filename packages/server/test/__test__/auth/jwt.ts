import { HttpStatus } from '@nestjs/common';
import { UserRole } from '@/typings';
import {
  createUserAndLogin,
  getToken,
  jwtExpires,
  setupRoot
} from '../../service/auth';
import { createUser } from '../../service/user';

const delay = (ms: number) => new Promise(_ => setTimeout(_, ms));

export function testJWT() {
  beforeAll(async () => {
    await setupRoot();
  });

  test.skip(
    'JWT expires',
    async () => {
      let response = await createUserAndLogin(root.token, {
        role: UserRole.Admin
      });

      const token = await getToken(response);

      // create user success
      response = await createUser(token);
      expect(response.error).toBeFalse();

      // wait for expires
      await delay(jwtExpires);

      // token should become invalid
      response = await createUser(token);
      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    },
    jwtExpires * 2
  );
}
