import React from 'react';
import { Button } from '@blueprintjs/core';
import { deleteAnnouncement } from '@/service';
import { Schema$Announcement } from '@/typings';
import { openConfirmDialog } from '@/components/ConfirmDialog';

export interface OnDelete {
  onDelete: (payload: Pick<Schema$Announcement, 'id'>) => void;
}

interface Props extends OnDelete {
  id: string;
}

export function DeleteAnnouncement({ id, onDelete }: Props) {
  function handleClick() {
    openConfirmDialog({
      icon: 'trash',
      intent: 'danger',
      title: 'Delete Announcement',
      onConfirm: async () => {
        await deleteAnnouncement({ id });
        onDelete({ id });
      }
    });
  }
  return <Button icon="trash" onClick={handleClick} />;
}
