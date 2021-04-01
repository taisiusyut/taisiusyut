import {
  Schema$Announcement,
  Param$CreateAnnouncement,
  Param$GetAnnouncements,
  PaginateResult,
  Param$UpdateAnnouncement
} from '@/typings';
import { api } from './api';
import { routes } from './routes';

export function createAnnouncement(payload: Param$CreateAnnouncement) {
  return api.post<Schema$Announcement>(routes.create_announcement, payload);
}

export function updateAnnouncement({
  id,
  ...payload
}: Param$UpdateAnnouncement) {
  return api.patch<Schema$Announcement>(
    routes.update_announcement.generatePath({ id }),
    payload
  );
}

export function deleteAnnouncement({ id }: { id: string }) {
  return api.delete<Schema$Announcement>(
    routes.delete_announcement.generatePath({ id })
  );
}

export function getAnnouncements(params?: Param$GetAnnouncements) {
  return api.get<PaginateResult<Schema$Announcement>>(
    routes.get_announcements,
    { params }
  );
}
