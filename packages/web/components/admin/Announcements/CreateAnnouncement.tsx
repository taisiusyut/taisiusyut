import React from 'react';
import { Button } from '@blueprintjs/core';
import { createAnnouncement } from '@/service';
import { Schema$Announcement } from '@/typings';
import { openAnnouncementDialog } from './AnnouncementDialog';

interface Props {
  onSuccess: (payload: Schema$Announcement) => void;
}

export function CreateAnnouncement({ onSuccess }: Props) {
  function handleClick() {
    openAnnouncementDialog({
      icon: 'document',
      title: 'Create Announcement',
      onConfirm: async payload => {
        const response = await createAnnouncement(payload);
        onSuccess(response);
      }
    });
  }
  return (
    <Button intent="primary" text="Create Announcement" onClick={handleClick} />
  );
}
