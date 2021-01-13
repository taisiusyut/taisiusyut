import React from 'react';
import { Statistics } from '@/components/admin/Statistics';
import { AnnouncementBoard } from './AnnouncementBoard';
import classes from './AdminHome.module.scss';

export function AdminHome() {
  return (
    <div className={classes['container']}>
      <AnnouncementBoard />
      <Statistics />
    </div>
  );
}
