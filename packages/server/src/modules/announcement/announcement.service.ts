import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MongooseCRUDService, PaginateModel, Document } from '@/utils/mongoose';
import { Announcement } from './schemas/announcement.schema';

@Injectable()
export class AnnouncementService extends MongooseCRUDService<Announcement> {
  constructor(
    @InjectModel(Announcement.name)
    readonly announcementModel: PaginateModel<Announcement & Document>
  ) {
    super(announcementModel);
  }
}
