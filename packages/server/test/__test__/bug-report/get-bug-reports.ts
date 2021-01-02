import { BugReportService } from '@/modules/bug-report/bug-report.service';
import { Schema$BugReport } from '@/typings';
import { getUser, setupUsers } from '../../service/auth';
import {
  createBugReport,
  createBugReportDto,
  getBugReports
} from '../../service/bug-report';

export function testGetBugReports() {
  const reports: Schema$BugReport[] = [];

  beforeAll(async () => {
    await setupUsers();
    const users = [undefined, author, client];

    await app.get(BugReportService).clear();

    for (const user of users) {
      const payload = createBugReportDto();
      const token = user && user.token;
      const response = await createBugReport(token, payload);
      reports.push(response.body);
    }
  });

  test.each`
    user        | length
    ${'root'}   | ${3}
    ${'admin'}  | ${3}
    ${'author'} | ${1}
    ${'client'} | ${1}
  `('$user get bug reports', async ({ user, length }) => {
    const auth = getUser(user);
    const response = await getBugReports(auth.token);
    expect(response.body.data).toHaveLength(length);
  });
}
