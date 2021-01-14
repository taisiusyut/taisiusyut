import {
  CreateAnnouncementDto,
  GetAnnouncementsDto,
  UpdateAnnouncementDto
} from '@/modules/announcement/dto';
import { routes } from '@/constants';
import { Param$CreateAnnouncement, AnnouncementType } from '@/typings';
import { rid } from '@/utils/rid';
import qs from 'querystring';
import dayjs from 'dayjs';

export function createAnnouncementDto(
  payload?: Partial<CreateAnnouncementDto>
): Param$CreateAnnouncement {
  const start = dayjs().startOf('day');
  const end = dayjs().endOf('day');
  return {
    title: rid(10),
    description: rid(20),
    start: start.toDate().getTime(),
    end: end.toDate().getTime(),
    type: AnnouncementType.Public,
    ...payload
  };
}

export function createAnnouncement(
  token: string,
  payload?: Partial<CreateAnnouncementDto>
) {
  return request
    .post(routes.create_announcement)
    .set('Authorization', `bearer ${token}`)
    .send(createAnnouncementDto(payload));
}

export function updateAnnouncement(
  token: string,
  id: string,
  payload?: Partial<UpdateAnnouncementDto>
) {
  return request
    .patch(routes.update_announcement.generatePath({ id }))
    .set('Authorization', `bearer ${token}`)
    .send(payload);
}

export function deleteAnnouncement(token: string, id: string) {
  return request
    .delete(routes.delete_announcement.generatePath({ id }))
    .set('Authorization', `bearer ${token}`)
    .send();
}

export function getAnnouncements(
  token: string,
  query: GetAnnouncementsDto = {}
) {
  return request
    .get(routes.get_announcements)
    .set('Authorization', `bearer ${token}`)
    .query(qs.stringify(query as qs.ParsedUrlQueryInput));
}
