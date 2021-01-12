import React, { useRef, useEffect } from 'react';
import { Icon } from '@blueprintjs/core';
import { Graph } from './graph';
import classes from './Chart.module.scss';

const getRandomIntInclusive = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export function Chart() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const target = ref.current;
    if (target) {
      new Graph({
        data: [
          ...Array.from({ length: 20 }).map(() => getRandomIntInclusive(0, 30)),
          ...Array.from({ length: 10 }).map(() => 0)
        ],
        target,
        // paddingBottom: 0,
        // paddingLeft: 0,
        // paddingRight: 0,
        // paddingTop: 0,
        // showCircle: true,
        // circle: '#55AA77',
        // circleSize: 4,
        background: '#2e2e2e',
        // showZeroLine: true,
        // centerZero: false,
        // zeroLineColor: '#EEE',
        lineColor: '#C5C5C5',
        lineWidth: 3,
        showBounds: false
      });
    }
  }, []);

  return (
    <div>
      <div className={classes['chart-title']}>Followers</div>
      <div className={classes['chart-sub-title']}>
        <span className={classes['chart-value']}>123</span>
        <Icon className={classes['chart-icon']} icon="arrow-up" />
        <div className={classes['chart-pect']}>5%</div>
      </div>
      <div className={classes['canvas']}>
        <canvas ref={ref} />
      </div>
    </div>
  );
}
