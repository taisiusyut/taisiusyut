import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Announcement,
  AnnouncementSchema
} from './schemas/announcement.schema';
import { AnnouncementService } from './announcement.service';
import { AnnouncementController } from './announcement.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Announcement.name,
        schema: AnnouncementSchema
      }
    ])
  ],
  controllers: [AnnouncementController],
  providers: [AnnouncementService]
})
export class AnnouncementModule {}
