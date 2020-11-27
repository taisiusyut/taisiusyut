import { Schema$Authenticated, Schema$User, UserRole } from '@/typings';
import { rid } from '@/utils/rid';
import { createUser, createUserDto } from '../../service/user';
import {
  createUserAndLogin,
  getToken,
  login,
  setupRoot,
  updateProfile
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
    property         | value            | suffix
    ${'role'}        | ${UserRole.Root} | ${''}
    ${'password'}    | ${rid(10)}       | ${''}
    ${'description'} | ${rid(20)}       | ${'(author only)'}
  `(
    '$property will not be update by client $suffix',
    async ({ property, value }: Record<string, any>) => {
      const response = await updateProfile(token, {
        [property]: value
      });
      expect(response.error).toBeFalse();
      expect(response.body).not.toHaveProperty('password');
      if (property !== 'password') {
        expect(response.body).toHaveProperty(
          property,
          user[property as keyof Schema$User]
        );
      }
    }
  );
}
