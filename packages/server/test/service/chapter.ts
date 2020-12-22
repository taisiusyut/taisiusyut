import {
  CreateChapterDto,
  GetChaptersDto,
  UpdateChapterDto
} from '@/modules/chapter/dto';
import { routes } from '@/constants';
import { ChapterType } from '@/typings';
import { rid } from '@/utils/rid';
import qs from 'querystring';

export function createChapterDto(
  payload?: Partial<CreateChapterDto>
): CreateChapterDto {
  if (payload?.type === ChapterType.Pay && !payload.price) {
    payload.price = 1;
  }

  return {
    name: rid(10),
    content: rid(10),
    type: ChapterType.Free,
    ...payload
  };
}

export function createChapter(
  token: string,
  bookID: string,
  payload?: Partial<CreateChapterDto>
) {
  return request
    .post(routes.create_chapter.generatePath({ bookID }))
    .set('Authorization', `bearer ${token}`)
    .send(createChapterDto(payload));
}

export function updateChapter(
  token: string,
  bookID: string,
  chapterID: string,
  payload?: Partial<UpdateChapterDto>
) {
  return request
    .patch(routes.update_chapter.generatePath({ bookID, chapterID }))
    .set('Authorization', `bearer ${token}`)
    .send(payload);
}

export function publicChapter(
  token: string,
  bookID: string,
  chapterID: string
) {
  return request
    .post(
      routes.public_chapter.generatePath({
        bookID,
        chapterID
      })
    )
    .set('Authorization', `bearer ${token}`)
    .send();
}

export function deleteChapter(
  token: string,
  bookID: string,
  chapterID: string
) {
  return request
    .delete(routes.delete_chapter.generatePath({ bookID, chapterID }))
    .set('Authorization', `bearer ${token}`)
    .send();
}

export function getChapters(
  token: string,
  bookID: string,
  query: GetChaptersDto = {}
) {
  return request
    .get(routes.get_chapters.generatePath({ bookID }))
    .set('Authorization', `bearer ${token}`)
    .query(qs.stringify(query as qs.ParsedUrlQueryInput));
}

export function getChapter(token: string, bookID: string, chapterID: string) {
  return request
    .get(routes.get_chapter.generatePath({ bookID, chapterID }))
    .set('Authorization', `bearer ${token}`)
    .send();
}

export function getChapterByNo(
  token: string,
  bookID: string,
  chapterNo: number
) {
  return request
    .get(routes.get_chapter_by_no.generatePath({ bookID, chapterNo }))
    .set('Authorization', `bearer ${token}`)
    .send();
}
