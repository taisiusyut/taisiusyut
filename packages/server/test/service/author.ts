import { routes } from '@/constants/routes';

export function getAuthorByName(authorName: string) {
  return request
    .get(routes.get_author_by_name.generatePath({ authorName }))
    .send();
}

export function calcAuthorWordCount(token: string, id?: string) {
  const path = id
    ? routes.author_word_count.generatePath({ id })
    : routes.author_word_count_no_id;
  return request.post(path).set('Authorization', `bearer ${token}`).send();
}

export function checkBookCollectionCount(token: string, id?: string) {
  const path = id
    ? routes.update_book_collection.generatePath({ id })
    : routes.update_book_collection_no_id;
  return request.post(path).set('Authorization', `bearer ${token}`).send();
}
