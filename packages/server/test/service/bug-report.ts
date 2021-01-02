import {
  CreateBugReportDto,
  GetBugReportsDto,
  UpdateBugReportDto
} from '@/modules/bug-report/dto';
import { routes } from '@/constants';
import { BugReportType } from '@/typings';
import { rid } from '@/utils/rid';
import qs from 'querystring';

export function createBugReportDto(
  payload?: Partial<CreateBugReportDto>
): CreateBugReportDto {
  return {
    title: rid(10),
    description: rid(100),
    type: BugReportType.UI,
    ...payload
  };
}

export function createBugReport(
  token?: string | undefined,
  payload?: Partial<CreateBugReportDto>
) {
  const _request = request.post(routes.create_bug_report);
  if (token) {
    _request.set('Authorization', `bearer ${token}`);
  }
  return _request.send(createBugReportDto(payload));
}

export function updateBugReport(
  token: string | undefined,
  id: string,
  payload?: Partial<UpdateBugReportDto>
) {
  return request
    .patch(routes.update_bug_report.generatePath({ id }))
    .set('Authorization', `bearer ${token}`)
    .send(payload);
}

export function getBugReports(token: string, query: GetBugReportsDto = {}) {
  return request
    .get(routes.get_bug_reports)
    .set('Authorization', `bearer ${token}`)
    .query(qs.stringify(query as qs.ParsedUrlQueryInput));
}

export function getBugReport(token: string, id: string) {
  return request
    .get(routes.get_bug_report.generatePath({ id }))
    .set('Authorization', `bearer ${token}`)
    .send();
}
