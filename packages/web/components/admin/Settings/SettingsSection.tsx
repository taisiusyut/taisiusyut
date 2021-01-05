import React from 'react';
import { Card, Divider, H4 } from '@blueprintjs/core';
import classes from './Settings.module.scss';

interface SectionProps {
  title?: string;
  className?: string;
  children?: React.ReactNode;
}

export function SettingsSection({
  className = '',
  title,
  children
}: SectionProps) {
  return (
    <Card className={`${classes['section']} ${className}`.trim()}>
      <H4>{title}</H4>
      <Divider />
      <div className={classes['section-content']}>{children}</div>
    </Card>
  );
}
