import {
  Schema$Authenticated,
  Schema$User,
  UserRole,
  UserStatus
} from '@/typings';
import { rid } from '@/utils/rid';
import { createUser, createUserDto, getUser } from '../../service/user';
import {
  createUserAndLogin,
  getToken,
  login,
  setupRoot,
  updateProfile,
  getGlobalUser
} from '../../service/auth';

export function testUpdateProfile() {
  let user: Schema$User;
  let token: string;
  const mockUserDto = createUserDto();
  const setupMockUser = async () => {
    if (user && token) {
      return [user, token] as const;
    }
    const response = await createUser(root.token, mockUserDto);
    user = response.body;
    token = await getToken(login(mockUserDto));

    return [user, token] as const;
  };

  beforeAll(async () => {
    await setupRoot();
  });

  beforeEach(async () => {
    await setupMockUser();
  });

  test('return updated value', async () => {
    const email = `${rid(8)}@gmail.com`;
    const response = await updateProfile(token, { email });
    expect(response.error).toBeFalse();
    expect(response.body).not.toHaveProperty('password');
    expect(response.body).toHaveProperty('email', email);
  });

  test('author can update description', async () => {
    let response = await createUserAndLogin(root.token, {
      role: UserRole.Author
    });
    expect(response.error).toBeFalse();

    const author: Schema$Authenticated = response.body;
    const description = rid(20);

    response = await updateProfile(author.token, {
      description
    });

    expect(response.error).toBeFalse();
    expect(response.body).toMatchObject({ description });
  });

  test.each`
    property         | value                 | users
    ${'role'}        | ${UserRole.Root}      | ${['root', 'admin', 'author', 'client']}
    ${'status'}      | ${UserStatus.Deleted} | ${['root', 'admin', 'author', 'client']}
    ${'password'}    | ${rid(10)}            | ${['root', 'admin', 'author', 'client']}
    ${'description'} | ${rid(20)}            | ${['root', 'admin', 'client']}
  `(
    '$property will not be update by $users',
    async ({ property, value, users }: Record<string, any>) => {
      for (const user of users) {
        const auth = getGlobalUser(user);
        const response = await updateProfile(auth.token, {
          [property]: value
        });
        expect(response.body).not.toHaveProperty('password');

        if (
          property !== 'password' &&
          !(property === 'role' && user === 'root')
        ) {
          const response = await getUser(root.token, auth.user.user_id);
          expect(response.body).not.toHaveProperty(property, value);
        }
      }
    }
  );
}
