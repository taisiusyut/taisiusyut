import React from 'react';
import { Card } from '@blueprintjs/core';
import FAQ from '@/guide/author-faq.md';
import classes from './AdminFAQ.module.scss';

export function AdminFAQ() {
  return (
    <Card className={classes['admin-faq']}>
      <FAQ />
    </Card>
  );
}
