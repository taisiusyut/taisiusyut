import React from 'react';
import { Colors, MenuItem } from '@blueprintjs/core';
import { deleteUser } from '@/service';
import { openConfirmDialog } from '@/components/ConfirmDialog';
import { Toaster } from '@/utils/toaster';

export interface OnDelete {
  onDelete: ({ id }: { id: string }) => void;
}

interface DeleteUserProps extends OnDelete {
  id: string;
  nickname?: string;
}

export function DeleteUser({ nickname, id, onDelete }: DeleteUserProps) {
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

  function handleClick() {
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
  }

  return <MenuItem icon="trash" text="Delete" onClick={handleClick} />;
}
