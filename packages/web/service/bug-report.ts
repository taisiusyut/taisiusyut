import { routes } from '@/constants';
import { Param$CreateBugReport, Schema$BugReport } from '@/typings';
import { api } from './api';

export const createBugReport = async (payload: Param$CreateBugReport) => {
  return api.post<Schema$BugReport>(routes.create_bug_report, payload);
};
