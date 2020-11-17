import React from 'react';
import { Card } from '@blueprintjs/core';
import { SettingsPreferences } from './SettingsPreferences';
import { SettingsProfile } from './SettingsProfile';
import classes from './Settings.module.scss';

export interface Props {}

export function Settings() {
  return (
    <div className={classes.settings}>
      <Card>
        <SettingsPreferences />
        <SettingsProfile />
      </Card>
    </div>
  );
}
