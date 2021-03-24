import React from 'react';
import {
  ClientHeader,
  ClientLeftPanelProps
} from '@/components/client/ClientLayout';
import { withAuthRequired } from '@/components/client/withAuthRequired';
import { ButtonPopover } from '@/components/ButtonPopover';
import { createBugReport } from '@/service';
import { BugReportStatus } from '@/typings';
import { ClientReportItem } from './ClientReportItem';
import { useClientReportDialog, icon, title } from './useClientReportDialog';
import { useClientReportPanel } from './useClientReportPanel';
import classes from './ClientReports.module.scss';

export interface ClientReportsProps extends ClientLeftPanelProps {}

const AuthRequiredButton = withAuthRequired(ButtonPopover);

export function ClientReportsPanel({ onLeave }: ClientReportsProps) {
  const { state, actions, scrollerRef } = useClientReportPanel();

  const openReportDialog = useClientReportDialog({
    request: createBugReport,
    onSuccess: report => actions.insert(report, 0)
  });

  const openNewReport = () => {
    openReportDialog({
      initialValues: {
        status: BugReportStatus.Open
      }
    });
  };

  const cloeButton = (
    <ButtonPopover minimal icon="cross" content="關閉" onClick={onLeave} />
  );

  const newReportButton = (
    <AuthRequiredButton
      minimal
      icon={icon}
      content="新增"
      onClick={openNewReport}
    />
  );

  return (
    <div className={classes['reports-panel']}>
      <ClientHeader title={title} left={cloeButton} right={newReportButton} />
      <div className={classes['reports-panel-content']} ref={scrollerRef}>
        {state.list.map(report => (
          <ClientReportItem key={report.id} report={report} />
        ))}
      </div>
    </div>
  );
}
