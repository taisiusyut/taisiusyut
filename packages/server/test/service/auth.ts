import { SuperAgentRequest, Response } from 'superagent';
import { ConfigService } from '@nestjs/config';
import { routes } from '@/constants/routes';
import { Param$Login, Schema$Authenticated, UserRole } from '@/typings';
import { createUserDto, CreateUserDto, createUser } from './user';

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
    username: configService.get('DEFAULT_USERNAME'),
    password: configService.get('DEFAULT_PASSWORD')
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

export async function setupRoot() {
  root = root.token ? root : await loginAsDefaultRoot().then(res => res.body);
}

export async function setupUsers() {
  const create = async (
    role: UserRole,
    exits?: Schema$Authenticated
  ): Promise<Schema$Authenticated> =>
    exits.token
      ? exits
      : createUserAndLogin(root.token, { role }).then(res => res.body);

  await setupRoot();

  [admin, author, client] = await Promise.all([
    create(UserRole.Admin, admin),
    create(UserRole.Author, author),
    create(UserRole.Client, client)
  ]);
}
