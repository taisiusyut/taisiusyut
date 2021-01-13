import React from 'react';
import { ConfirmDialog, ConfirmDialogProps } from '@/components/ConfirmDialog';
import { Param$CreateAnnouncement, Schema$Announcement } from '@/typings';
import { createOpenOverlay } from '@/utils/openOverlay';
import {
  AnnouncementForm,
  useAnnouncementForm,
  beforeSubmit
} from './AnnouncementForm';
import classes from './Announcements.module.scss';

interface Props extends Omit<ConfirmDialogProps, 'onConfirm'> {
  initialValues?: Partial<Schema$Announcement>;
  onConfirm: (payload: Param$CreateAnnouncement) => Promise<void>;
}

export const openAnnouncementDialog = createOpenOverlay(AnnouncementDialog);

export function AnnouncementDialog({
  onConfirm,
  initialValues,
  ...props
}: Props) {
  const [form] = useAnnouncementForm();

  async function handleConfirm() {
    const payload = await form.validateFields();
    await onConfirm(beforeSubmit(payload));
  }

  return (
    <ConfirmDialog {...props} onConfirm={handleConfirm}>
      <AnnouncementForm
        form={form}
        initialValues={initialValues}
        className={classes['form']}
      />
    </ConfirmDialog>
  );
}
