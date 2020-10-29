import { Response } from 'supertest';
import { HttpStatus } from '@nestjs/common';
import { UserRole } from '@/typings';
import { loginAsDefaultRoot, registration } from './service/auth';

describe('AuthController (e2e)', () => {
  describe(`(POST) Login`, () => {
    test('Login as default root', async () => {
      const response = await loginAsDefaultRoot();
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toMatchObject({ isDefaultAc: true });
    });
  });

  describe(`(POST) Registration`, () => {
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
