import React from 'react';
import { Card } from '@blueprintjs/core';
import { PageHeader } from '@/components/admin/PageHeader';
import { getAnnouncements } from '@/service';
import {
  createUsePaginationLocal,
  DefaultCRUDActionTypes
} from '@/hooks/usePaginationLocal';
import { Order, Param$GetAnnouncements } from '@/typings';
import { CreateAnnouncement } from './CreateAnnouncement';
import { AnnouncementTable } from './AnnouncementTable';
import classes from './Announcements.module.scss';

const useAnnouncements = createUsePaginationLocal(
  'id',
  (params?: Param$GetAnnouncements) =>
    getAnnouncements({ sort: { end: Order.DESC }, ...params }),
  {
    initializer: (state, reducer) =>
      reducer(state, {
        type: DefaultCRUDActionTypes.LIST,
        payload: Array.from({ length: state.pageSize }, (_, idx) => ({
          id: String(idx)
        }))
      })
  }
);

export function Announcements() {
  const { state, actions } = useAnnouncements();

  return (
    <Card className={classes['announcement']}>
      <PageHeader title="Announcements" className={classes['header']}>
        <CreateAnnouncement onSuccess={actions.create} />
      </PageHeader>
      <AnnouncementTable
        className={classes['table']}
        data={state.list}
        onUpdate={actions.update}
        onDelete={actions.delete}
      />
    </Card>
  );
}
