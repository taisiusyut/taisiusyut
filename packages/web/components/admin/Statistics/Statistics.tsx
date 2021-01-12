import React from 'react';
import { Card } from '@blueprintjs/core';
import { PageHeader } from '@/components/admin/PageHeader';
import { Chart } from '@/components/Chart';
import classes from './Statistics.module.scss';

export function Statistics() {
  const cards: React.ReactElement[] = [];

  for (let i = 0; i < 6; i++) {
    cards.push(
      <Card key={i}>
        <Chart />
      </Card>
    );
  }

  return (
    <div className={classes['container']}>
      <PageHeader className={classes['title']} title="Statistics" />
      <div className={classes['grid']}>{cards}</div>
    </div>
  );
}
