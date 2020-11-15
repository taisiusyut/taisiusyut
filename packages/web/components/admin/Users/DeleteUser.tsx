import React from 'react';
import { Colors, MenuItem, IMenuItemProps } from '@blueprintjs/core';
import { deleteUser } from '@/service';
import { openConfirmDialog } from '@/components/ConfirmDialog';
import { Toaster } from '@/utils/toaster';

export interface OnDelete {
  onDelete: ({ id }: { id: string }) => void;
}

interface DeleteUserProps extends OnDelete, Partial<IMenuItemProps> {
  id: string;
  nickname?: string;
}

export function DeleteUser({
  nickname,
  id,
  onDelete,
  onClick,
  ...props
}: DeleteUserProps) {
  async function onConfirm() {
    try {
      await deleteUser({ id });
      onDelete({ id });
      Toaster.success({ message: 'Delete user success' });
    } catch (error) {
      Toaster.apiError('Delete user failure', error);
      throw error;
    }
  }

  function handleClick(event: React.MouseEvent<HTMLElement, MouseEvent>) {
    openConfirmDialog({
      intent: 'danger',
      icon: 'trash',
      title: 'Delete User',
      onConfirm,
      children: (
        <div style={{ width: 300, lineHeight: '1.5em' }}>
          Are you sure to delete{' '}
          <b style={{ color: Colors.RED3 }}>{nickname}</b>'s account? This
          action is irreversible
        </div>
      )
    });
    onClick && onClick(event);
  }

  return (
    <MenuItem {...props} icon="trash" text="Delete" onClick={handleClick} />
  );
}
