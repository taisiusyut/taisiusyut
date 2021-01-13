import { IsString, IsEnum, IsInt } from 'class-validator';
import { Exclude } from 'class-transformer';
import {
  Schema$Announcement,
  Param$GetAnnouncement,
  AnnouncementType
} from '@/typings';
import { QueryDto } from '@/utils/mongoose';

class Excluded extends QueryDto implements Partial<Schema$Announcement> {
  @Exclude()
  id?: undefined;

  @Exclude()
  createdAt?: undefined;

  @Exclude()
  updatedAt?: undefined;
}

class GetAnnouncement
  extends Excluded
  implements
    Partial<Omit<Schema$Announcement, keyof Excluded>>,
    Partial<Omit<Param$GetAnnouncement, keyof Excluded>> {
  @IsString()
  title?: string;

  @IsString()
  description?: string;

  @IsInt()
  start?: number;

  @IsInt()
  end?: number;

  @IsEnum(AnnouncementType)
  type?: AnnouncementType;
}

export class GetAnnouncementDto
  extends GetAnnouncement
  implements
    Required<Omit<Schema$Announcement, keyof GetAnnouncement>>,
    Required<Omit<Param$GetAnnouncement, keyof GetAnnouncement>> {}
