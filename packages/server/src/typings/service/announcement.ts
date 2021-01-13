import { Pagination, Timestamp } from './index';

export enum AnnouncementType {
  Public = 1
}

export interface Schema$Announcement extends Timestamp {
  id: string;
  title: string;
  description: string;
  start: number;
  end: number;
  type: AnnouncementType;
}

export interface Param$GetAnnouncements extends Pagination {
  start?: number;
  end?: number;
  type?: AnnouncementType;
}

export interface Param$CreateAnnouncement {
  title: string;
  description: string;
  start: number;
  end: number;
  type: AnnouncementType;
}

export interface Param$UpdateAnnouncement {
  id: string;
  title?: string;
  description?: string;
  start?: number;
  end?: number;
  type?: AnnouncementType;
}
