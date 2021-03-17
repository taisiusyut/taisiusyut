import { routes } from '@/constants';
import {
  PaginateResult,
  Param$CreateBugReport,
  Param$GetBugReports,
  Schema$BugReport
} from '@/typings';
import { api } from './api';

export const createBugReport = async (payload: Param$CreateBugReport) => {
  return api.post<Schema$BugReport>(routes.create_bug_report, payload);
};

export const getBugReports = async (params?: Param$GetBugReports) => {
  return api.get<PaginateResult<Schema$BugReport>>(routes.get_bug_reports, {
    params
  });
};
