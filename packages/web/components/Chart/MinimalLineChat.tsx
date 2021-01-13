import React, { useRef, useEffect } from 'react';
import { Icon, IIconProps } from '@blueprintjs/core';
import { Graph, GraphCreate } from './graph';
import classes from './Chart.module.scss';

export interface MinimalLineChartProps {
  title: string;
  value: string | number;
  changes: number;
  data: GraphCreate['data'];
}

function getIconProps(changes: number): IIconProps {
  if (changes > 0) return { icon: 'arrow-up' };
  if (changes < 0) return { icon: 'arrow-down' };
  return { icon: 'minus' };
}

function getColorClassname(changes: number): string {
  if (changes > 0) return classes['red'];
  if (changes < 0) return classes['green'];
  return classes['gray'];
}

export function MinimalLineChart({
  data,
  title,
  changes,
  value
}: MinimalLineChartProps) {
  const ref = useRef<HTMLCanvasElement>(null);
  const colorClassName = getColorClassname(changes);

  useEffect(() => {
    const target = ref.current;
    if (target) {
      new Graph({
        data,
        target,
        background: 'transparent',
        lineColor: '#C5C5C5',
        lineWidth: 2
      });
    }
  }, [data]);

  return (
    <div>
      <div className={classes['title']}>{title}</div>
      <div className={classes['sub-title']}>
        <span className={classes['value']}>{value}</span>
        <Icon
          {...getIconProps(changes)}
          className={`${classes['arrow']} ${colorClassName}`}
        />
        <div className={`${classes['changes']} ${colorClassName}`}>
          {Math.abs(changes)}%
        </div>
      </div>
      <div className={classes['canvas']}>
        <canvas ref={ref} />
      </div>
    </div>
  );
}
