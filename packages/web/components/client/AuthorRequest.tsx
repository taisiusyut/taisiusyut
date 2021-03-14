import React, { useCallback } from 'react';
import { useRxAsync } from 'use-rx-hooks';
import { Spinner } from '@blueprintjs/core';
import { ListItem, ListItemProps } from '@/components/ListViewOverlay';
import { AuthActions } from '@/hooks/useAuth';
import { authorRequest } from '@/service';
import { Schema$User } from '@/typings';
import { Toaster } from '@/utils/toaster';

const spinner = <Spinner size={18} />;

export interface AuthorRequestProps
  extends ListItemProps,
    Pick<AuthActions, 'updateProfile'> {}

const onFailure = Toaster.apiError.bind(Toaster, `request failure`);

export function AuthorRequest({
  updateProfile,
  rightElement
}: AuthorRequestProps) {
  const onSuccess = useCallback(
    (payload: Partial<Schema$User>) => {
      updateProfile(payload);
    },
    [updateProfile]
  );
  const [{ loading }, { fetch }] = useRxAsync(authorRequest, {
    defer: true,
    onSuccess,
    onFailure
  });

  return (
    <ListItem
      rightElement={loading ? spinner : rightElement}
      onClick={loading ? undefined : fetch}
    >
      成為作者
    </ListItem>
  );
}
