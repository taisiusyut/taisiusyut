import { IsEnum, IsInt } from 'class-validator';
import { Exclude } from 'class-transformer';
import {
  Schema$Announcement,
  Param$CreateAnnouncement,
  AnnouncementType
} from '@/typings';
import { IsTitle, IsDescription } from './index';

class Excluded implements Partial<Schema$Announcement> {
  @Exclude()
  id?: undefined;

  @Exclude()
  createdAt?: undefined;

  @Exclude()
  updatedAt?: undefined;
}

class CreateAnnouncement
  extends Excluded
  implements
    Partial<Omit<Schema$Announcement, keyof Excluded>>,
    Partial<Omit<Param$CreateAnnouncement, keyof Excluded>> {
  title?: string;
}

export class CreateAnnouncementDto
  extends CreateAnnouncement
  implements
    Required<Omit<Schema$Announcement, keyof CreateAnnouncement>>,
    Required<Omit<Param$CreateAnnouncement, keyof CreateAnnouncement>> {
  @IsTitle()
  title: string;

  @IsDescription()
  description: string;

  @IsInt()
  start: number;

  @IsInt()
  end: number;

  @IsEnum(AnnouncementType)
  type: AnnouncementType;
}
