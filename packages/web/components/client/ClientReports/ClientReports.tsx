import React from 'react';
import { ClientHeader } from '@/components/client/ClientLayout';
import { ButtonPopover } from '@/components/ButtonPopover';
import classes from './ClientReports.module.scss';

export interface ClientReportsProps {
  onLeave: () => void;
}

export function ClientReports({ onLeave }: ClientReportsProps) {
  return (
    <div className={classes['client-reports']}>
      <ClientHeader
        title="問題/建議"
        left={
          <ButtonPopover
            minimal
            icon="cross"
            content="關閉"
            onClick={onLeave}
          />
        }
      />
    </div>
  );
}
