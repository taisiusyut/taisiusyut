import { CreateBookDto } from '@/modules/book/dto';
import { routes } from '@/constants';
import { Param$CreateBook } from '@/typings';
import { rid } from '@/utils/rid';

export function createBookDto(
  payload: Partial<CreateBookDto>
): Param$CreateBook {
  return { title: rid(10), ...payload };
}

export function createBook(token: string, payload?: Partial<CreateBookDto>) {
  return request
    .post(routes.create_book)
    .set('Authorization', `bearer ${token}`)
    .send(createBookDto(payload));
}
