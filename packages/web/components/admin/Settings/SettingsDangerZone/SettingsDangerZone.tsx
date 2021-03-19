import React from 'react';
import { Divider } from '@blueprintjs/core';
import { SettingsSection } from '../SettingsSection';
import { ModifyPassword } from './ModifyPassword';
import { DeleteAccount } from './DeleteAccount';
import classes from '../Settings.module.scss';

interface RowProps {
  title?: string;
  desc?: string;
  children?: React.ReactNode;
}

function Row({ title, desc, children }: RowProps) {
  return (
    <div>
      <div>
        <b>{title}</b> {desc}
      </div>
      <div>{children}</div>
    </div>
  );
}

export function SettingsDangerZone() {
  return (
    <SettingsSection title="Danger Zone" className={classes['danger-zone']}>
      <div className={classes['danger-zone-content']}>
        <Row title="修改密碼" desc="為保護你的帳號，建議定期修改你的密碼">
          <ModifyPassword />
        </Row>

        <Divider />

        <Row title="刪除帳號" desc="當帳號刪除後，無法復原，請考慮清楚">
          <DeleteAccount />
        </Row>
      </div>
    </SettingsSection>
  );
}
