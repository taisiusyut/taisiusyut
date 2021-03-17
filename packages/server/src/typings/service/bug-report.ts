import { Pagination, Timestamp, Search, DateRangeQuery } from './';

export enum BugReportStatus {
  Open = 1,
  ReOpen,
  Closed,
  Fixed,
  Invalid,
  InProgress
}

export enum BugReportType {
  UI = 1,
  Book,
  Chapter,
  Other
}

export interface Schema$BugReport extends Timestamp {
  id: string;
  title: string;
  description: string;
  version?: string;
  status: BugReportStatus;
  type: BugReportType;
  user?: string;
}

export interface Param$CreateBugReport {
  title: string;
  description: string;
  status: BugReportStatus;
  type: BugReportType;
}

export interface Param$UpdateBugReport {
  title?: string;
  description?: string;
  status?: BugReportStatus;
  type?: BugReportType;
}

export interface Param$GetBugReports
  extends Pagination,
    Search,
    DateRangeQuery {
  id?: string;
  user?: string;
  title?: string;
  status?: BugReportStatus;
  type?: BugReportType;
}
