import { CreateUserDto, UpdateUserDto } from '@/modules/user/dto';
import { routes } from '@/constants/routes';
import { rid } from '@/utils/rid';
import { UserRole } from '@/typings';
import qs from 'querystring';

export { CreateUserDto, UpdateUserDto };

export const createUserDto = (
  payload?: Partial<CreateUserDto>
): CreateUserDto => {
  const name = rid(8);
  return {
    username: `e2e${name}`,
    password: `e2e-${rid()}`,
    email: `e2e-${rid()}@gmail.com`,
    role: UserRole.Client,
    ...payload
  };
};

export function createUser(token: string, dto: Partial<CreateUserDto> = {}) {
  return request
    .post(routes.create_user)
    .set('Authorization', `bearer ${token}`)
    .send(createUserDto(dto) as any);
}

export function getUsers(token: string, query: Record<string, any> = {}) {
  return request
    .get(routes.get_users)
    .set('Authorization', `bearer ${token}`)
    .query(qs.stringify(query));
}

export function getUser(token: string, id: string) {
  return request
    .get(routes.get_user.generatePath({ id }))
    .set('Authorization', `bearer ${token}`)
    .send();
}

export function updateUser(
  token: string,
  id: string,
  changes: UpdateUserDto | Record<string, unknown>
) {
  return request
    .patch(routes.update_user.generatePath({ id }))
    .set('Authorization', `bearer ${token}`)
    .send((changes || {}) as Record<string, unknown>);
}

export function deleteUser(token: string, id: string) {
  return request
    .delete(routes.update_user.generatePath({ id }))
    .set('Authorization', `bearer ${token}`)
    .send();
}
