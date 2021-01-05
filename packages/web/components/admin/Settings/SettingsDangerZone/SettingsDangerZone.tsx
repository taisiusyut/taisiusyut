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
        <Row
          title="Modify Password"
          desc="To protect the information in your account, it is suggested to change your password periodically."
        >
          <ModifyPassword />
        </Row>

        <Divider />

        <Row
          title="Delete this Account"
          desc="Once you delete this account, there is no going back. Please be certain."
        >
          <DeleteAccount />
        </Row>
      </div>
    </SettingsSection>
  );
}
