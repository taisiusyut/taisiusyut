import { routes } from '@/constants/routes';

export function getAuthorByName(authorName: string) {
  return request
    .get(routes.get_author_by_name.generatePath({ authorName }))
    .send();
}
