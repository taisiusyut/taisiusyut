import { ObjectId } from 'mongodb';
import { BugReportStatus, Schema$BugReport, UserRole } from '@/typings';
import { rid } from '@/utils/rid';
import { HttpStatus } from '@nestjs/common';
import { getGlobalUser, setupUsers } from '../../service/auth';
import {
  createBugReport,
  createBugReportDto,
  updateBugReport
} from '../../service/bug-report';

export function testUpdateBugReport() {
  const reports: Schema$BugReport[] = [];

  beforeAll(async () => {
    await setupUsers();

    const users = [undefined, author, client];
    for (const user of users) {
      const payload = createBugReportDto();
      const token = user && user.token;
      const response = await createBugReport(token, payload);
      reports.push(response.body);
    }
  });

  test.each(['root', 'admin'])('%s can update bug report ', async user => {
    const auth = getGlobalUser(user);
    const isAdmin =
      auth?.user.role === UserRole.Root || auth?.user.role === UserRole.Admin;

    for (const [idx, report] of reports.entries()) {
      const changes = {
        title: rid(10),
        version: '1.0.0',
        status: BugReportStatus.Closed
      };
      const response = await updateBugReport(auth.token, report.id, changes);

      reports[idx] = { ...report, ...changes };

      expect(response.body).toEqual({
        ...reports[idx],
        ...(isAdmin && idx !== 0 ? { user: expect.any(String) } : {}),
        updatedAt: expect.any(Number)
      });
    }
  });

  test('anonymous cannot update bug report ', async () => {
    const changes = { title: rid(10) };
    const response = await updateBugReport(undefined, reports[0].id, changes);
    expect(response.status).toBe(HttpStatus.FORBIDDEN);
  });

  test.each`
    property     | value
    ${'user'}    | ${new ObjectId().toHexString()}
    ${'version'} | ${'1.0.0'}
    ${'status'}  | ${BugReportStatus.Closed}
  `(
    '$property will not update by author/client',
    async ({ property, value }) => {
      const payload = [
        [author, reports[1]],
        [client, reports[2]]
      ] as const;

      for (const [auth, report] of payload) {
        const changes = { [property]: value };
        const response = await updateBugReport(auth.token, report.id, changes);
        expect(response.body).toEqual({
          ...report,
          updatedAt: expect.any(Number)
        });
      }
    }
  );
}
