import { BugReportService } from '@/modules/bug-report/bug-report.service';
import { Schema$BugReport } from '@/typings';
import { getGlobalUser, setupUsers } from '../../service/auth';
import {
  createBugReport,
  createBugReportDto,
  getBugReports
} from '../../service/bug-report';

export function testGetBugReports() {
  const reports: Schema$BugReport[] = [];

  beforeAll(async () => {
    await setupUsers();
    await app.get(BugReportService).clear();

    const users = [author, client];
    for (const user of users) {
      const payload = createBugReportDto();
      const response = await createBugReport(user.token, payload);
      reports.push(response.body);
    }
  });

  test.each(['anonymous', 'root', 'admin', 'author', 'client'])(
    '%s could get bug reports',
    async user => {
      const auth = getGlobalUser(user) || {};
      const response = await getBugReports(auth.token);
      expect(response.body.data).toHaveLength(reports.length);
    }
  );
}
