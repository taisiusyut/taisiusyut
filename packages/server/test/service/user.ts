import { SuperAgentRequest } from 'superagent';
import { CreateUserDto, UpdateUserDto } from '@/modules/user/dto';
import { routes } from '@/constants/routes';
import { rid } from '@/utils/rid';
import qs from 'qs';

export { CreateUserDto, UpdateUserDto };

export const createUserDto = (
  payload?: Partial<CreateUserDto>
): CreateUserDto => {
  const name = rid(8);
  return {
    username: `e2e${name}`,
    password: `e2e-${rid()}`,
    email: `e2e-${rid()}@gmail.com`,
    ...payload
  };
};

export function createUser(
  token: string,
  dto: Partial<CreateUserDto> = {}
): SuperAgentRequest {
  return request
    .post(routes.create_user)
    .set('Authorization', `bearer ${token}`)
    .send(createUserDto(dto) as any);
}

export function getUsers(
  token: string,
  query: Record<string, any> = {}
): SuperAgentRequest {
  return request
    .get(routes.get_users)
    .set('Authorization', `bearer ${token}`)
    .query(qs.stringify(query));
}

export function updateUser(
  token: string,
  { id, ...changes }: UpdateUserDto
): SuperAgentRequest {
  return request
    .patch(routes.update_user.generatePath({ id }))
    .set('Authorization', `bearer ${token}`)
    .send((changes || {}) as any);
}
