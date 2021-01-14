import React from 'react';
import { useRxAsync } from 'use-rx-hooks';
import { Card } from '@blueprintjs/core';
import { getAnnouncements } from '@/service';
import { Skelecton } from '@/components/Skelecton';
import { PageHeader } from '@/components/admin/PageHeader';
import { Order } from '@/typings';
import dayjs from 'dayjs';
import classes from './AdminHome.module.scss';

const request = () =>
  getAnnouncements({
    pageSize: 1,
    before: +new Date(),
    sort: { end: Order.DESC }
  }).then(response => response.data[0]);

export function AnnouncementBoardContent() {
  const [{ data, loading }] = useRxAsync(request);

  if (!loading && !data) {
    return <Card className={classes['board']}> --- </Card>;
  }

  return (
    <Card className={classes['board']}>
      <div className={classes['row']}>
        <div className={classes['title']}>
          <Skelecton length={6}>{data?.title}</Skelecton>
        </div>
        <div className={classes['date']}>
          <Skelecton length={4}>
            {dayjs(data?.start).format(`YYYY-MM-DD`)}
          </Skelecton>
        </div>
      </div>
      <div className={classes['description']}>
        <Skelecton length={100}>{data?.description}</Skelecton>
      </div>
    </Card>
  );
}

export function AnnouncementBoard() {
  return (
    <>
      <PageHeader title="Announcement" />
      <AnnouncementBoardContent />
    </>
  );
}
