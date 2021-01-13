import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MongooseCRUDService, Model } from '@/utils/mongoose';
import { Announcement } from './schemas/announcement.schema';

@Injectable()
export class AnnouncementService extends MongooseCRUDService<Announcement> {
  constructor(
    @InjectModel(Announcement.name)
    readonly announcementModel: Model<Announcement>
  ) {
    super(announcementModel);
  }
}
