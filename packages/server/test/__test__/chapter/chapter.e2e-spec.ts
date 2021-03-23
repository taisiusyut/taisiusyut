import { testCreateChapter } from './create-chapter';
import { testUpdateChapter } from './update-chapter';
import { testDeleteChapter } from './delete-chapter';
import { testGetChapters } from './get-chapters';
import { testGetChapter, testGetChapterByNo } from './get-chapter';
import { testPublishChapter } from './publish-chapter';

describe('ChapterController (e2e)', () => {
  describe('(POST) Create Chapter', testCreateChapter);
  describe('(PATCH) Update Chapter', testUpdateChapter);
  describe('(DEL) Delete Chapter', testDeleteChapter);
  describe('(GET) Get Chapters', testGetChapters);
  describe('(GET) Get Chapter', testGetChapter);
  describe('(GET) Get Chapter By Number', testGetChapterByNo);
  describe('(POST) Publish Chapter', testPublishChapter);
});
