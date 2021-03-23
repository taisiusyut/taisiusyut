import { testCreateBugReport } from './create-bug-report';
import { testUpdateBugReport } from './update-bug-report';
import { testDeleteBugReports } from './delete-bug-report';
import { testGetBugReports } from './get-bug-reports';

describe('BugReportController (e2e)', () => {
  describe('(POST) Create Bug Report', testCreateBugReport);
  describe('(PATCH) Update Bug Report', testUpdateBugReport);
  describe('(GET) Get Bug Reports', testGetBugReports);
  describe('(DEL) Delete Bug Report', testDeleteBugReports);
});
