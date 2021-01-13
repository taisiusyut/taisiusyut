import React from 'react';
import { Button } from '@blueprintjs/core';
import { updateAnnouncement } from '@/service';
import { Schema$Announcement } from '@/typings';
import { openAnnouncementDialog } from './AnnouncementDialog';

export interface OnUpdate {
  onUpdate: (payload: Schema$Announcement) => void;
}

interface Props extends OnUpdate {
  data: Schema$Announcement;
}

export function UpdateAnnouncement({ data, onUpdate }: Props) {
  function handleClick() {
    openAnnouncementDialog({
      icon: 'edit',
      title: 'Update Announcement',
      initialValues: data,
      onConfirm: async payload => {
        const response = await updateAnnouncement({ ...payload, id: data.id });
        onUpdate(response);
      }
    });
  }
  return <Button icon="edit" onClick={handleClick} />;
}
