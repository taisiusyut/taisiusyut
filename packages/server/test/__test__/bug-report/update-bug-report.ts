import { ObjectId } from 'mongodb';
import { BugReportStatus, Schema$BugReport } from '@/typings';
import { rid } from '@/utils/rid';
import { HttpStatus } from '@nestjs/common';
import { getGlobalUser, setupUsers } from '../../service/auth';
import {
  createBugReport,
  createBugReportDto,
  updateBugReport
} from '../../service/bug-report';

export function testUpdateBugReport() {
  let reports: Schema$BugReport[] = [];

  beforeAll(async () => {
    await setupUsers();
  });

  beforeEach(async () => {
    reports = [];
    const users = [author, client];
    for (const user of users) {
      const payload = createBugReportDto();
      const token = user && user.token;
      const response = await createBugReport(token, payload);
      reports.push(response.body);
    }
  });

  test.each(['root', 'admin'])('%s can update bug report ', async user => {
    const auth = getGlobalUser(user);

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
        user: expect.any(String),
        updatedAt: expect.any(Number),
        version: expect.any(String)
      });

      expect(response.body.user).not.toBeUUID(4);
    }
  });

  test.each(['author', 'client'])(
    '%s can update his/her bug report ',
    async user => {
      const auth = getGlobalUser(user);
      const report = reports[user === 'author' ? 0 : 1];

      if (!report) {
        throw new Error(`report not found`);
      }

      const changes = {
        title: rid(10),
        status: BugReportStatus.Closed
      };
      const response = await updateBugReport(auth.token, report.id, changes);

      expect(response.body).toEqual({
        ...report,
        ...changes,
        updatedAt: expect.any(Number),
        version: expect.any(String)
      });
    }
  );

  test('anonymous cannot update bug report ', async () => {
    const changes = { title: rid(10) };
    const response = await updateBugReport(undefined, reports[0].id, changes);
    expect(response.status).toBe(HttpStatus.FORBIDDEN);
  });

  test.each`
    property     | value
    ${'user'}    | ${new ObjectId().toHexString()}
    ${'version'} | ${'1.0.0'}
  `(
    '$property will not update by author/client',
    async ({ property, value }) => {
      const payload = [
        [author, reports[0]],
        [client, reports[1]]
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
