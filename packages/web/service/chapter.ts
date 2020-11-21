import { routes } from '@/constants';
import {
  PaginateResult,
  Param$GetChapters,
  Param$CreateChapter,
  Param$UpdateChapter,
  Schema$Chapter
} from '@/typings';
import { api } from './api';

export const getChapters = ({ bookID, ...params }: Param$GetChapters = {}) =>
  api.get<PaginateResult<Schema$Chapter>>(
    routes.get_chapters.generatePath({ bookID }),
    { params }
  );

export const getChapter = ({
  bookID,
  chapterID
}: {
  bookID: string;
  chapterID: string;
}) =>
  api.get<Schema$Chapter>(
    routes.get_chapter.generatePath({ bookID, chapterID })
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
