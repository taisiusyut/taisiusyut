import React, { useMemo } from 'react';
import { useRxAsync } from 'use-rx-hooks';
import { Spinner } from '@blueprintjs/core';
import { ListItem, ListItemProps } from '@/components/ListViewOverlay';
import { withAuthRequired } from '@/components/client/withAuthRequired';
import { useAuthActions } from '@/hooks/useAuth';
import { authorRequest, clearJwtToken, getJwtToken } from '@/service';
import { Toaster } from '@/utils/toaster';
import { Schema$Author } from '@/typings';

export interface AuthorRequestProps extends ListItemProps {}

const spinner = <Spinner size={18} />;

const onFailure = Toaster.apiError.bind(Toaster, `request failure`);

const AuthrizedListItem = withAuthRequired(ListItem);

export function AuthorRequest({
  rightElement,
  ...itemProps
}: AuthorRequestProps) {
  const { updateProfile, logout } = useAuthActions();

  const { request } = useMemo(() => {
    const request = async (): Promise<Partial<Schema$Author>> => {
      const user = await authorRequest();
      try {
        clearJwtToken();
        await getJwtToken();
      } catch (error) {
        logout({ slient: true });
        Toaster.apiError(`發生錯誤，請重新登入`, error);
        return {};
      }
      return user;
    };
    return { request };
  }, [logout]);

  const [{ loading }, { fetch }] = useRxAsync(request, {
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
