import { testCreateChapter } from './create-chapter';
import { testUpdateChapter } from './update-chapter';

describe('ChapterController (e2e)', () => {
  describe('(POST) Create Chapter', testCreateChapter);
  describe('(PTCH) Update Chapter', testUpdateChapter);
  // describe('(DEL)  Delete Chapter', testDeleteChapter);
  // describe('(GET)  Get Chapters', testGetChapters);
  // describe('(GET)  Get Chapter', testGetChapter);
});
