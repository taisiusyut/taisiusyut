import React, { useEffect } from 'react';
import { ClientHeader } from '@/components/client/ClientLayout';
import { withAuthRequired } from '@/components/client/withAuthRequired';
import { ButtonPopover } from '@/components/ButtonPopover';
import { createBugReport } from '@/service';
import { BugReportStatus, BugReportType } from '@/typings';
import { ClientReportItem } from './ClientReportItem';
import { useClientReportDialog, icon, title } from './useClientReportDialog';
import { useClientReports } from './useClientReports';
import classes from './ClientReports.module.scss';
import { useRouter } from 'next/router';

export interface ClientReportsProps {
  onLeave: () => void;
}

const AuthRequiredButton = withAuthRequired(ButtonPopover);

export function ClientReports({ onLeave }: ClientReportsProps) {
  const { state, actions, scrollerRef } = useClientReports();
  const router = useRouter();
  const deletedReportId: string | null =
    router.asPath === '/reports' &&
    typeof router.query.deletedReportId === 'string'
      ? router.query.deletedReportId
      : null;

  const openReportDialog = useClientReportDialog({
    request: createBugReport,
    onSuccess: report => actions.insert(report, 0)
  });

  const openNewReport = () => {
    openReportDialog({
      initialValues: {
        status: BugReportStatus.Open,
        ...(process.env.NODE_ENV === 'development' && {
          type: BugReportType.Other,
          title: '廣係綠麼務由',
          description: `深工公治兩社數小成，應怎兩機未角前飛？部她書年長大證男直少哥它總白視所子不北直康起我很市業表，的星場聲部質！的教產林見主；早想臺使化，好度朋散古者已了動山，間他成金日；`
        })
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
    if (deletedReportId) {
      actions.delete({ id: deletedReportId });
      scrollerRef.current?.scrollTo(0, 0);
    }
  }, [deletedReportId, actions, scrollerRef]);

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
