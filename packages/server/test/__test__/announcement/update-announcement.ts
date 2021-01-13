import { HttpStatus } from '@nestjs/common';
import { Schema$Announcement } from '@/typings';
import {
  updateAnnouncement,
  createAnnouncement,
  createAnnouncementDto
} from '../../service/announcement';
import { getGlobalUser, setupUsers } from '../../service/auth';

export function testUpdateAnnouncement() {
  let announcement: Schema$Announcement;

  beforeAll(async () => {
    await setupUsers();
    const response = await createAnnouncement(root.token);
    announcement = response.body;
  });

  test.each(['root', 'admin'])('%s can update announcement', async user => {
    const auth = getGlobalUser(user);
    const dto = createAnnouncementDto();
    const response = await updateAnnouncement(auth.token, announcement.id, dto);
    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body).toEqual({
      ...dto,
      id: expect.any(String),
      createdAt: announcement.createdAt,
      updatedAt: expect.anything()
    });
  });

  test.each(['author', 'client', 'anonymous'])(
    '%s cannot update announcement',
    async user => {
      const auth = getGlobalUser(user);
      const dto = createAnnouncementDto();
      const response = await updateAnnouncement(
        auth?.token,
        announcement.id,
        dto
      );
      expect(response.status).toBe(HttpStatus.FORBIDDEN);
    }
  );
}
