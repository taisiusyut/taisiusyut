import React from 'react';
import { useRxAsync } from 'use-rx-hooks';
import { Spinner } from '@blueprintjs/core';
import { ListItem, ListItemProps } from '@/components/ListViewOverlay';
import { withAuthRequired } from '@/components/client/withAuthRequired';
import { AuthActions } from '@/hooks/useAuth';
import { authorRequest } from '@/service';
import { Toaster } from '@/utils/toaster';

export interface AuthorRequestProps
  extends ListItemProps,
    Pick<AuthActions, 'updateProfile'> {}

const spinner = <Spinner size={18} />;

const onFailure = Toaster.apiError.bind(Toaster, `request failure`);

const AuthrizedListItem = withAuthRequired(ListItem);

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
    <AuthrizedListItem
      {...itemProps}
      rightElement={loading ? spinner : rightElement}
      onClick={loading ? undefined : fetch}
    >
      成為作者
    </AuthrizedListItem>
  );
}
