import { testCreateAnnouncement } from './create-announcement';
import { testUpdateAnnouncement } from './update-announcement';
import { testDeleteAnnouncement } from './delete-announcement';
import { testGetAnnouncements } from './get-announcements';

describe('AnnouncementController (e2e)', () => {
  describe('(POST) Create Announcement', testCreateAnnouncement);
  describe('(PTCH) Update Announcement', testUpdateAnnouncement);
  describe('(DEL) Delete Announcement', testDeleteAnnouncement);
  describe('(GET) Get Announcements', testGetAnnouncements);
});
