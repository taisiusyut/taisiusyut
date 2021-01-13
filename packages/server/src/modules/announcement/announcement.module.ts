import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Announcement,
  AnnouncementSchema
} from './schemas/announcement.schema';
import { AnnouncementService } from './announcement.service';
import { AnnouncementController } from './announcement.controller';
import paginate from 'mongoose-paginate-v2';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Announcement.name,
        useFactory: async () => {
          AnnouncementSchema.plugin(paginate);
          return AnnouncementSchema;
        }
      }
    ])
  ],
  controllers: [AnnouncementController],
  providers: [AnnouncementService]
})
export class AnnouncementModule {}
