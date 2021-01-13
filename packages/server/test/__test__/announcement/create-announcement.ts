import { HttpStatus } from '@nestjs/common';
import {
  createAnnouncement,
  createAnnouncementDto
} from '../../service/announcement';
import { getGlobalUser, setupUsers } from '../../service/auth';

export function testCreateAnnouncement() {
  beforeAll(async () => {
    await setupUsers();
  });

  test.each(['root', 'admin'])('%s can create announcement', async user => {
    const auth = getGlobalUser(user);
    const dto = createAnnouncementDto();
    const response = await createAnnouncement(auth.token, dto);
    expect(response.status).toBe(HttpStatus.CREATED);
    expect(response.body).toEqual({
      ...dto,
      id: expect.any(String),
      createdAt: expect.anything(),
      updatedAt: expect.anything()
    });
  });

  test.each(['author', 'client', 'anonymous'])(
    '%s cannot create announcement',
    async user => {
      const auth = getGlobalUser(user);
      const dto = createAnnouncementDto();
      const response = await createAnnouncement(auth?.token, dto);
      expect(response.status).toBe(HttpStatus.FORBIDDEN);
    }
  );
}
