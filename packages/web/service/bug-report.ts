import { routes } from '@/constants';
import {
  Param$CreateBugReport,
  Param$GetBugReports,
  Schema$BugReport
} from '@/typings';
import { api } from './api';

export const createBugReport = async (payload: Param$CreateBugReport) => {
  return api.post<Schema$BugReport>(routes.create_bug_report, payload);
};

export const getBugReport = async (params?: Param$GetBugReports) => {
  return api.get<Schema$BugReport[]>(routes.get_bug_reports, { params });
};
