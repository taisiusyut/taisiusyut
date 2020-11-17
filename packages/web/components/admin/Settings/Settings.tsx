import React from 'react';
import { Card } from '@blueprintjs/core';
import { SettingsProfile } from './SettingsProfile';
import classes from './Settings.module.scss';

export interface Props {}

export function Settings() {
  return (
    <div className={classes.settings}>
      <Card>
        <SettingsProfile />
      </Card>
    </div>
  );
}
