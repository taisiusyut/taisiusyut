import React, { ReactNode, useState } from 'react';
import { BlankButton } from '@/components/BlankButton';
import classes from './ClientLayout.module.scss';

export interface HeaderProps {
  className?: string;
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
    (_, idx) => <BlankButton key={idx} />
  );
}

export function ClientHeader({
  className = '',
  title,
  children,
  left,
  right = children
}: HeaderProps) {
  const [fillLeft] = useState(createSpacer(left, right));
  const [fillRight] = useState(createSpacer(right, left));

  return (
    <div className={`${classes['header']} ${className}`.trim()}>
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
