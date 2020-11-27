import { SuperAgentRequest, Response } from 'superagent';
import { ConfigService } from '@nestjs/config';
import { DeleteAccountDto, ModifyPasswordDto } from '@/modules/auth/dto';
import { routes } from '@/constants/routes';
import { Param$Login, Schema$Authenticated, UserRole } from '@/typings';
import {
  createUserDto,
  CreateUserDto,
  createUser,
  UpdateUserDto
} from './user';

export async function login(payload: Param$Login): Promise<Response> {
  return request.post(routes.login).send(payload);
}

export async function getToken(
  payload: Response | Promise<Response>
): Promise<string> {
  return (payload instanceof Promise ? payload : Promise.resolve(payload)).then(
    res => {
      if (res.error) {
        return Promise.reject(res.error.text);
      }
      return res.body.token;
    }
  );
}

export function registration(dto: Partial<CreateUserDto>): SuperAgentRequest {
  return request.post(routes.registration).send(createUserDto(dto));
}

export function loginAsDefaultRoot(): Promise<Response> {
  const configService = app.get<ConfigService>(ConfigService);
  return login({
    username: configService.get('DEFAULT_USERNAME', ''),
    password: configService.get('DEFAULT_PASSWORD', '')
  });
}

export async function createUserAndLogin(
  token: string,
  dto: Partial<CreateUserDto> = {}
): Promise<Response> {
  const user = createUserDto(dto);
  const userRes = await createUser(token, user);
  return userRes.error
    ? Promise.reject(userRes.error.text) //
    : login(user);
}

export function refreshToken(token: string) {
  return request.post(routes.refresh_token).set('Cookie', [token]).send();
}

export function logout() {
  return request.post(routes.logout);
}

export function deleteAccount(token: string, dto: DeleteAccountDto) {
  return request
    .delete(routes.delete_account)
    .set('Authorization', `bearer ${token}`)
    .send(dto);
}

export function modifyPassword(token: string, dto: ModifyPasswordDto) {
  return request
    .patch(routes.modify_password)
    .set('Authorization', `bearer ${token}`)
    .send(dto);
}

export async function setupRoot() {
  if (root.token) {
    return root;
  }
  const token = await getToken(loginAsDefaultRoot());
  const response = await createUserAndLogin(token, {
    role: UserRole.Root
  });
  root = response.body;

  return root;
}

export async function createUsers(useGlobal = false) {
  await setupRoot();

  const create = async (
    role: UserRole,
    exits: Schema$Authenticated
  ): Promise<Schema$Authenticated> =>
    exits.token && useGlobal
      ? exits
      : createUserAndLogin(root.token, { role }).then(res => res.body);

  return await Promise.all([
    create(UserRole.Admin, admin),
    create(UserRole.Author, author),
    create(UserRole.Client, client)
  ]);
}

export async function setupUsers() {
  [admin, author, client] = await createUsers(true);
}

export function getProfile(token: string) {
  return request
    .get(routes.profile)
    .set('Authorization', `bearer ${token}`)
    .send();
}

export function updateProfile(
  token: string,
  changes: UpdateUserDto | Record<string, unknown>
) {
  return request
    .patch(routes.profile)
    .set('Authorization', `bearer ${token}`)
    .send(changes);
}

export const getUser = (user: unknown) => global[user as 'root'];
