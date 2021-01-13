import { HttpStatus } from '@nestjs/common';
import { Schema$Announcement } from '@/typings';
import {
  createAnnouncement,
  getAnnouncements
} from '../../service/announcement';
import { getGlobalUser, setupUsers } from '../../service/auth';

export function testGetAnnouncements() {
  const announcements: Schema$Announcement[] = [];

  beforeAll(async () => {
    await setupUsers();
    for (let i = 0; i < 3; i++) {
      const response = await createAnnouncement(root.token);
      announcements.push(response.body);
    }
  });

  test.each(['root', 'admin', 'author'])(
    '%s can access announcements',
    async user => {
      const auth = getGlobalUser(user);
      const response = await getAnnouncements(auth.token);
      expect(response.body.data).toEqual(expect.arrayContaining(announcements));
    }
  );

  test.each(['client', 'anonymous'])(
    '%s cannot access announcements',
    async user => {
      const auth = getGlobalUser(user);
      const response = await getAnnouncements(auth?.token);
      expect(response.status).toBe(HttpStatus.FORBIDDEN);
    }
  );
}
