import { routes } from '@/constants';
import {
  PaginateResult,
  Param$CreateBugReport,
  Param$GetBugReports,
  Param$UpdateBugReport,
  Schema$BugReport
} from '@/typings';
import { api } from './api';

export const createBugReport = async (payload: Param$CreateBugReport) => {
  return api.post<Schema$BugReport>(routes.create_bug_report, payload);
};

export const updateBugReport = async ({
  id,
  ...payload
}: Param$UpdateBugReport) => {
  return api.patch<Schema$BugReport>(
    routes.update_bug_report.generatePath({ id }),
    payload
  );
};

export const getBugReports = async (params?: Param$GetBugReports) => {
  return api.get<PaginateResult<Schema$BugReport>>(routes.get_bug_reports, {
    params
  });
};

export const getBugReport = async (id: string) => {
  return api.get<Schema$BugReport>(routes.get_bug_report.generatePath({ id }));
};
