import { BugReportStatus, UserRole } from '@/typings';
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
      const isAdmin =
        user?.user.role === UserRole.Root || user?.user.role === UserRole.Admin;

      expect(response.body).toEqual({
        ...payload,
        ...(isAdmin ? { user: expect.any(String) } : {}),
        status: BugReportStatus.Open,
        id: expect.any(String),
        version: expect.any(String),
        createdAt: expect.any(Number),
        updatedAt: expect.any(Number)
      });
    }
  });
}
