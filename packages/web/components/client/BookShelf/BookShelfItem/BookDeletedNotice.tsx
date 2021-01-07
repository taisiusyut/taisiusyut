import React, { useCallback } from 'react';
import { useRxAsync } from 'use-rx-hooks';
import { Button, Icon } from '@blueprintjs/core';
import { removeBookFromShelfById } from '@/service';
import { Toaster } from '@/utils/toaster';
import classes from './BookShelfItem.module.scss';

interface Props {
  id: string;
  onSuccess: (payload: { bookID: string }) => void;
}

const onFailure = Toaster.apiError.bind(
  Toaster,
  `Remove book from shelf failure`
);

export function BookDeletedNotice({ id, onSuccess: _onSuccess }: Props) {
  const onSuccess = useCallback(
    () =>
      _onSuccess({
        // Note: the value of id actually is book shelf id
        bookID: id
      }),
    [id, _onSuccess]
  );
  const [{ loading }, { fetch }] = useRxAsync(removeBookFromShelfById, {
    defer: true,
    onSuccess,
    onFailure
  });

  return (
    <div className={classes['deleted']}>
      <div>
        <Icon
          iconSize={28}
          icon="warning-sign"
          className={classes['deleted-icon']}
        />
        <div>書籍已被刪除</div>
        <Button
          small
          intent="primary"
          text="確認"
          loading={loading}
          onClick={() => fetch(id)}
        />
      </div>
    </div>
  );
}
