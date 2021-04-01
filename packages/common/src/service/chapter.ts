import {
  PaginateResult,
  Param$GetChapters,
  Param$CreateChapter,
  Param$UpdateChapter,
  Param$PublishChapter,
  Schema$Chapter
} from '@/typings';
import { api } from './api';
import { routes } from './routes';

export interface Pram$GetChapter {
  bookID: string;
  chapterID: string;
}
export interface Pram$GetChapterByName {
  bookID: string;
  chapterNo: number;
}

export const getChapters = ({ bookID, ...params }: Param$GetChapters = {}) =>
  api.get<PaginateResult<Schema$Chapter>>(
    routes.get_chapters.generatePath({ bookID }),
    { params }
  );

export const getChapter = ({ bookID, chapterID }: Pram$GetChapter) =>
  api.get<Schema$Chapter>(
    routes.get_chapter.generatePath({ bookID, chapterID })
  );

export const getChapterByNo = ({ bookID, chapterNo }: Pram$GetChapterByName) =>
  api.get<Schema$Chapter>(
    routes.get_chapter_by_no.generatePath({ bookID, chapterNo })
  );

export const createChapter = ({ bookID, ...payload }: Param$CreateChapter) =>
  api.post<Schema$Chapter>(
    routes.create_chapter.generatePath({ bookID }),
    payload
  );

export const updateChapter = ({
  bookID,
  chapterID,
  ...payload
}: Param$UpdateChapter) =>
  api.patch<Schema$Chapter>(
    routes.update_chapter.generatePath({ bookID, chapterID }),
    payload
  );

export const publishChapter = ({ bookID, chapterID }: Param$PublishChapter) =>
  api.post<Schema$Chapter>(
    routes.publish_chapter.generatePath({ bookID, chapterID })
  );
