import React from 'react';
import { MenuItem, IIconProps, IMenuItemProps } from '@blueprintjs/core';
import { openConfirmDialog } from '@/components/ConfirmDialog';
import { Schema$User } from '@/typings';
import { Toaster } from '@/utils/toaster';
import { updateUser } from '@/service';

export interface OnUpdate {
  onUpdate: (payload: Schema$User) => void;
}

interface Create {
  text: string;
  title: string;
  icon: IIconProps['icon'];
  intent?: IIconProps['intent'];
}

export interface UserMenuItemProps extends OnUpdate, Partial<IMenuItemProps> {
  children?: React.ReactNode;
  user: Schema$User;
  getPayload: () => Promise<Partial<Schema$User>> | Partial<Schema$User>;
}

export function createUserMenuItem({ icon, intent, title, text }: Create) {
  return function UserMenuItem({
    onUpdate,
    children,
    onClick,
    user,
    getPayload,
    ...props
  }: UserMenuItemProps) {
    function handleClick(event: React.MouseEvent<HTMLElement, MouseEvent>) {
      openConfirmDialog({
        icon,
        title,
        intent,
        onConfirm: async () => {
          const payload = await getPayload();
          try {
            const updated = await updateUser({ ...payload, id: user.id });
            onUpdate(updated);
            Toaster.success({ message: `${title.toLowerCase()} success` });
          } catch (error) {
            Toaster.apiError(`${title.toLowerCase()} failure`, error);
            throw error;
          }
        },
        children
      });
      onClick && onClick(event);
    }

    return (
      <MenuItem {...props} icon={icon} text={text} onClick={handleClick} />
    );
  };
}
