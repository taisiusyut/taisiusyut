import { IsEnum, IsOptional } from 'class-validator';
import { Exclude } from 'class-transformer';
import {
  Schema$Announcement,
  Param$GetAnnouncements,
  AnnouncementType
} from '@/typings';
import { QueryDto } from '@/utils/mongoose';
import { DateRange } from '@/decorators';

class Excluded extends QueryDto implements Partial<Schema$Announcement> {
  @Exclude()
  id?: undefined;

  @Exclude()
  title?: undefined;

  @Exclude()
  description?: undefined;

  @Exclude()
  createdAt?: undefined;

  @Exclude()
  updatedAt?: undefined;
}

class GetAnnouncement
  extends Excluded
  implements
    Partial<Omit<Schema$Announcement, keyof Excluded>>,
    Partial<Omit<Param$GetAnnouncements, keyof Excluded>> {
  @IsOptional()
  @DateRange()
  start?: number;

  @IsOptional()
  @DateRange()
  end?: number;

  @IsOptional()
  @IsEnum(AnnouncementType)
  type?: AnnouncementType;
}

export class GetAnnouncementsDto
  extends GetAnnouncement
  implements
    Required<Omit<Schema$Announcement, keyof GetAnnouncement>>,
    Required<Omit<Param$GetAnnouncements, keyof GetAnnouncement>> {}
