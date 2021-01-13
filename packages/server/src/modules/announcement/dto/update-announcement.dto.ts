import { IsString, IsEnum, IsInt, IsOptional } from 'class-validator';
import { Exclude } from 'class-transformer';
import {
  Schema$Announcement,
  Param$UpdateAnnouncement,
  AnnouncementType
} from '@/typings';

class Excluded implements Partial<Schema$Announcement> {
  @Exclude()
  id?: undefined;

  @Exclude()
  createdAt?: undefined;

  @Exclude()
  updatedAt?: undefined;
}

class UpdateAnnouncement
  extends Excluded
  implements
    Partial<Omit<Schema$Announcement, keyof Excluded>>,
    Partial<Omit<Param$UpdateAnnouncement, keyof Excluded>> {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @IsOptional()
  start?: number;

  @IsInt()
  @IsOptional()
  end?: number;

  @IsEnum(AnnouncementType)
  type?: AnnouncementType;
}

export class UpdateAnnouncementDto
  extends UpdateAnnouncement
  implements
    Required<Omit<Schema$Announcement, keyof UpdateAnnouncement>>,
    Required<Omit<Param$UpdateAnnouncement, keyof UpdateAnnouncement>> {}
