import React from 'react';
import { H4 } from '@blueprintjs/core';
import { GoBackButton } from '@/components/GoBackButton';
import { GoBackOptions } from '@/hooks/useGoBack';
import classes from './PageHeader.module.scss';

interface Props {
  title?: React.ReactNode;
  children?: React.ReactNode;
  targetPath?: GoBackOptions['targetPath'];
  className?: string;
}

export function PageHeader({
  title,
  targetPath,
  children,
  className = ''
}: Props) {
  return (
    <div className={`${classes['header']} ${className}`.trim()}>
      <div className={classes['title']}>
        {targetPath && (
          <GoBackButton targetPath={targetPath} className={classes['button']} />
        )}
        <H4 className={classes['h4']}>{title}</H4>
      </div>
      <div>{children}</div>
    </div>
  );
}
