import React from 'react';
import { Announcement } from '@/components/admin/Announcement';
import { Statistics } from '@/components/admin/Statistics';
import classes from './AdminHome.module.scss';

export function AdminHome() {
  return (
    <div className={classes['container']}>
      <Announcement />
      <Statistics />
    </div>
  );
}
