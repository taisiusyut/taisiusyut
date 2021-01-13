import React from 'react';
import { Card } from '@blueprintjs/core';
import { PageHeader } from '@/components/admin/PageHeader';
import { MinimalLineChart } from '@/components/Chart';
import classes from './Statistics.module.scss';

//The maximum is inclusive and the minimum is inclusive
const getRandomIntInclusive = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export function Statistics() {
  const cards: React.ReactElement[] = [];

  for (let i = 0; i < 6; i++) {
    const actucal = Array.from({ length: 20 }, () =>
      getRandomIntInclusive(0, 30)
    );
    const data = [
      ...actucal,
      ...Array.from({ length: 30 - actucal.length }, () => 0)
    ];
    const [prev, value] = actucal.slice(-2);
    const changes = ((value - prev) / prev) * 100;

    cards.push(
      <Card key={i}>
        <MinimalLineChart
          title="Followers"
          data={data}
          value={value}
          changes={Math.floor(changes * 100) / 100}
        />
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
