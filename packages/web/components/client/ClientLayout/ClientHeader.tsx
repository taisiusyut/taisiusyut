import React, { ReactNode, useState } from 'react';
import { Button } from '@blueprintjs/core';
import classes from './ClientLayout.module.scss';

export const Blank = () => (
  <Button minimal icon="blank" style={{ visibility: 'hidden' }} />
);

export interface HeaderProps {
  title?: ReactNode;
  left?: ReactNode | ReactNode[];
  right?: ReactNode | ReactNode[];
  children?: ReactNode;
}

function getLength(payload: unknown) {
  return Array.isArray(payload) ? payload.length : payload ? 1 : 0;
}

function createSpacer(self: unknown, target: unknown) {
  return Array.from(
    { length: Math.max(0, getLength(target) - getLength(self)) },
    (_, idx) => (
      <Button key={idx} minimal icon="blank" style={{ visibility: 'hidden' }} />
    )
  );
}

export function ClientHeader({
  title,
  children,
  left,
  right = children
}: HeaderProps) {
  const [fillLeft] = useState(createSpacer(left, right));
  const [fillRight] = useState(createSpacer(right, left));

  return (
    <div className={classes['header']}>
      <div className={classes['left']}>
        {left}
        {fillLeft}
      </div>
      <div className={classes['header-title']}>{title}</div>
      <div className={classes['right']}>
        {fillRight}
        {right}
      </div>
    </div>
  );
}
