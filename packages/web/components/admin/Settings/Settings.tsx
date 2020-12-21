import React from 'react';
import { SettingsPreferences } from './SettingsPreferences';
import { SettingsProfile } from './SettingsProfile';
import { SettingsDangerZone } from './SettingsDangerZone';
import classes from './Settings.module.scss';

export interface Props {}

export function Settings() {
  return (
    <div className={classes['settings']}>
      <SettingsProfile />
      <SettingsPreferences />
      <SettingsDangerZone />
    </div>
  );
}
