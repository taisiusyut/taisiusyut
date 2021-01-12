import React from 'react';
import { Card } from '@blueprintjs/core';
import { PageHeader } from '@/components/admin/PageHeader';
import classes from './Announcement.module.scss';

export function Announcement() {
  return (
    <div className={classes['container']}>
      <PageHeader className={classes['title']} title="Announcement" />
      <Card></Card>
    </div>
  );
}
