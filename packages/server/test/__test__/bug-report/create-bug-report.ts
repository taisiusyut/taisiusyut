import { BugReportStatus } from '@/typings';
import { setupUsers } from '../../service/auth';
import { createBugReport, createBugReportDto } from '../../service/bug-report';

export function testCreateBugReport() {
  beforeAll(async () => {
    await setupUsers();
  });

  test('create bug report success', async () => {
    const users = [root, admin, author, client];

    for (const user of users) {
      const payload = createBugReportDto();
      const response = await createBugReport(user.token, payload);

      expect(response.body).toEqual({
        ...payload,
        user: expect.any(String),
        status: BugReportStatus.Open,
        id: expect.any(String),
        version: expect.any(String),
        createdAt: expect.any(Number),
        updatedAt: expect.any(Number)
      });

      expect(response.body.user).not.toBeUUID(4);
    }
  });
}
