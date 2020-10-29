import { Response } from 'supertest';
import { HttpStatus } from '@nestjs/common';
import { loginAsDefaultRoot, registration } from './service/auth';
import { UserRole } from '@/typings';
import { routes } from '@/main';

describe('AuthController (e2e)', () => {
  describe(`(POST) ${routes.login}`, () => {
    test('Login as default root', async () => {
      const response = await loginAsDefaultRoot();
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toMatchObject({ isDefaultAc: true });
    });
  });

  describe(`(POST) ${routes.registration}`, () => {
    test('These roles should not be registered', async () => {
      const roles = [UserRole.Root, UserRole.Admin, UserRole.Author];
      await expect(
        Promise.all(roles.map(role => registration({ role })))
      ).resolves.toSatisfyAll(
        (response: Response) => response.status === HttpStatus.BAD_REQUEST
      );
    });

    test('Client registration', async () => {
      await expect(
        Promise.all([
          registration({ role: undefined }),
          registration({ role: UserRole.Client })
        ])
      ).resolves.toSatisfyAll(
        (response: Response) => response.status === HttpStatus.CREATED
      );
    });
  });
});
