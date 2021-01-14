import {
  Controller,
  Post,
  Body,
  Delete,
  Patch,
  Query,
  Get
} from '@nestjs/common';
import { routes } from '@/constants';
import { Access } from '@/utils/access';
import { ObjectId } from '@/decorators';
import { AnnouncementService } from './announcement.service';
import {
  CreateAnnouncementDto,
  GetAnnouncementsDto,
  UpdateAnnouncementDto
} from './dto';

@Controller(routes.announcement.prefix)
export class AnnouncementController {
  constructor(private readonly announcementService: AnnouncementService) {}

  @Access('announcement_create')
  @Post(routes.announcement.create_announcement)
  create(@Body() createDto: CreateAnnouncementDto) {
    return this.announcementService.create(createDto);
  }

  @Access('announcement_update')
  @Patch(routes.announcement.update_announcement)
  update(@ObjectId('id') id: string, @Body() updateDto: UpdateAnnouncementDto) {
    return this.announcementService.findOneAndUpdate({ _id: id }, updateDto);
  }

  @Access('announcement_delete')
  @Delete(routes.announcement.delete_announcement)
  delete(@ObjectId('id') id: string) {
    return this.announcementService.delete({ _id: id });
  }

  @Access('announcement_get_all')
  @Get(routes.announcement.get_announcements)
  getAll(@Query() { before, ...queryDto }: GetAnnouncementsDto) {
    return this.announcementService.paginate({
      ...queryDto,
      ...(before ? { end: { $gte: before } } : {})
    });
  }
}
