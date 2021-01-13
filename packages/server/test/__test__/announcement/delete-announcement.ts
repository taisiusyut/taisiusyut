import { HttpStatus } from '@nestjs/common';
import { Schema$Announcement } from '@/typings';
import {
  deleteAnnouncement,
  createAnnouncement,
  getAnnouncements
} from '../../service/announcement';
import { getGlobalUser, setupUsers } from '../../service/auth';

export function testDeleteAnnouncement() {
  let announcement: Schema$Announcement;

  beforeAll(async () => {
    await setupUsers();
  });

  beforeEach(async () => {
    const response = await createAnnouncement(root.token);
    announcement = response.body;
  });

  test.each(['root', 'admin'])('%s can delete announcement', async user => {
    const auth = getGlobalUser(user);
    let response = await getAnnouncements(root.token);
    const announcements = response.body.data;

    response = await deleteAnnouncement(auth.token, announcement.id);
    expect(response.status).toBe(HttpStatus.OK);

    response = await getAnnouncements(root.token);
    expect(response.body.data).toHaveLength(announcements.length - 1);
    expect(response.body.data).not.toContain({
      id: announcement.id
    });
  });

  test.each(['author', 'client', 'anonymous'])(
    '%s cannot delete announcement',
    async user => {
      const auth = getGlobalUser(user);
      const response = await deleteAnnouncement(auth?.token, announcement.id);
      expect(response.status).toBe(HttpStatus.FORBIDDEN);
    }
  );
}
