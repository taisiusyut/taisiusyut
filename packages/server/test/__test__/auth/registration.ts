import { HttpStatus } from '@nestjs/common';
import { UserService } from '@/modules/user/user.service';
import { Schema$Authenticated, UserRole, UserStatus } from '@/typings';
import { login, registration, loginAsDefaultRoot } from '../../service/auth';
import { createUserDto, getUser } from '../../service/user';

export function testRegistration() {
  let defaultRoot: Schema$Authenticated;

  beforeAll(async () => {
    const response = await loginAsDefaultRoot();
    expect(response.body).toHaveProperty('isDefaultAc', true);
    defaultRoot = response.body;
  });

  afterAll(() => app.get(UserService).clear());

  test('role and status property will be ignored', async () => {
    const roles = [
      UserRole.Root,
      UserRole.Admin,
      UserRole.Author,
      UserRole.Client
    ].map(role => ({ role }));

    const status = Object.values(UserStatus)
      .filter((s): s is UserStatus => typeof s === 'number')
      .map(status => ({ status }));

    for (const payload of [...roles, ...status]) {
      const dto = createUserDto(payload);
      expect(dto).toMatchObject(payload);

      let response = await registration(dto);
      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body.role).toBe(UserRole.Client);

      response = await getUser(defaultRoot.token, response.body.id);
      expect(response.body.status).toBe(UserStatus.Active);

      response = await login(dto);
      expect(response.status).toBe(HttpStatus.OK);
    }
  });
}
