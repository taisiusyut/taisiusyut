import React from 'react';
import { useRxAsync } from 'use-rx-hooks';
import { Spinner } from '@blueprintjs/core';
import { ListItem, ListItemProps } from '@/components/ListViewOverlay';
import { AuthActions } from '@/hooks/useAuth';
import { authorRequest } from '@/service';
import { Toaster } from '@/utils/toaster';

const spinner = <Spinner size={18} />;

export interface AuthorRequestProps
  extends ListItemProps,
    Pick<AuthActions, 'updateProfile'> {}

const onFailure = Toaster.apiError.bind(Toaster, `request failure`);

export function AuthorRequest({
  updateProfile,
  rightElement,
  ...itemProps
}: AuthorRequestProps) {
  const [{ loading }, { fetch }] = useRxAsync(authorRequest, {
    defer: true,
    onSuccess: updateProfile,
    onFailure
  });

  return (
    <ListItem
      {...itemProps}
      rightElement={loading ? spinner : rightElement}
      onClick={loading ? undefined : fetch}
    >
      成為作者
    </ListItem>
  );
}
