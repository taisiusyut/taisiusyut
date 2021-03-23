import { BugReportService } from '@/modules/bug-report/bug-report.service';
import { Schema$Authenticated, Schema$BugReport, UserRole } from '@/typings';
import { HttpStatus } from '@nestjs/common';
import {
  createUserAndLogin,
  getGlobalUser,
  setupUsers
} from '../../service/auth';
import {
  createBugReport,
  deleteBugReport,
  getBugReport
} from '../../service/bug-report';

export function testDeleteBugReports() {
  let report: Schema$BugReport;
  let otherClient: Schema$Authenticated;

  beforeAll(async () => {
    await setupUsers();
    await app.get(BugReportService).clear();

    let response = await createUserAndLogin(admin.token, {
      role: UserRole.Client
    });
    otherClient = response.body;

    response = await createBugReport(otherClient.token);
    report = response.body;
  });

  test('anonymous cannot delete other bug report', async () => {
    const response = await deleteBugReport(undefined as any, report.id);
    expect(response.status).toBe(HttpStatus.FORBIDDEN);
  });

  test.each(['author', 'client'])(
    '%s cannot delete other bug report',
    async user => {
      const auth = getGlobalUser(user);
      const id = report.id;
      let response = await deleteBugReport(auth?.token, id);
      expect(response.status).toBe(HttpStatus.OK);

      response = await getBugReport(auth.token, id);
      expect(response.status).toBe(HttpStatus.OK);
    }
  );

  test.each(['author', 'client'])(
    '%s could delete his/her bug report',
    async user => {
      const auth = getGlobalUser(user);
      let response = await createBugReport(auth.token);
      const report: Schema$BugReport = response.body;
      const id = report.id;

      response = await getBugReport(auth.token, id);
      expect(response.status).toBe(HttpStatus.OK);

      response = await deleteBugReport(auth?.token, id);
      expect(response.status).toBe(HttpStatus.OK);

      response = await getBugReport(auth.token, id);
      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    }
  );

  test.each(['root', 'admin'])(
    "%s could delete all user's bug report",
    async user => {
      const auth = getGlobalUser(user);
      const users = ['root', 'admin', 'author', 'client'];

      for (const user of users) {
        let response = await createBugReport(getGlobalUser(user).token);
        const report: Schema$BugReport = response.body;
        const id = report.id;

        response = await getBugReport(auth.token, id);
        expect(response.status).toBe(HttpStatus.OK);

        response = await deleteBugReport(auth.token, id);
        expect(response.status).toBe(HttpStatus.OK);

        response = await getBugReport(auth.token, id);
        expect(response.status).toBe(HttpStatus.NOT_FOUND);
      }
    }
  );
}
