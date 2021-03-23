import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { ClientHeader } from '@/components/client/ClientLayout';
import { withAuthRequired } from '@/components/client/withAuthRequired';
import { ButtonPopover } from '@/components/ButtonPopover';
import { createBugReport } from '@/service';
import { BugReportStatus, Schema$BugReport } from '@/typings';
import { JSONParse } from '@/utils/JSONParse';
import { ClientReportItem } from './ClientReportItem';
import { useClientReportDialog, icon, title } from './useClientReportDialog';
import { useClientReports } from './useClientReports';
import classes from './ClientReports.module.scss';

export interface ClientReportsProps {
  onLeave: () => void;
}

const AuthRequiredButton = withAuthRequired(ButtonPopover);

export function ClientReportsPanel({ onLeave }: ClientReportsProps) {
  const { state, actions, scrollerRef } = useClientReports();
  const { query } = useRouter();

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

  useEffect(() => {
    const { deletedReportId, update } = query;

    if (deletedReportId && typeof deletedReportId === 'string') {
      actions.delete({ id: deletedReportId });
      scrollerRef.current?.scrollTo(0, 0);
    }

    if (update && typeof update === 'string') {
      const report = JSONParse<Schema$BugReport>(update);
      if (report) actions.update(report);
    }
  }, [query, actions, scrollerRef]);

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
