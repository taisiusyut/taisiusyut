import React from 'react';
import { ClientHeader } from '@/components/client/ClientLayout';
import { withAuthRequired } from '@/components/client/withAuthRequired';
import { ButtonPopover } from '@/components/ButtonPopover';
import { createBugReport } from '@/service';
import { BugReportType } from '@/typings';
import { ClientReportItem } from './ClientReportItem';
import { useClientReportAction, icon, title } from './useClientReportAction';
import { useClientReports } from './useClientReports';
import classes from './ClientReports.module.scss';

export interface ClientReportsProps {
  onLeave: () => void;
}

const AuthRequiredButton = withAuthRequired(ButtonPopover);

export function ClientReports({ onLeave }: ClientReportsProps) {
  const { state, actions, scrollerRef } = useClientReports();

  const openReportDialog = useClientReportAction({
    request: createBugReport,
    onSuccess: report => actions.insert(report, 0)
  });

  const openNewReport = () => {
    openReportDialog({
      initialValues: {
        type: BugReportType.Other,
        title: '廣係綠麼務由',
        description: `深工公治兩社數小成，應怎兩機未角前飛？部她書年長大證男直少哥它總白視所子不北直康起我很市業表，的星場聲部質！的教產林見主；早想臺使化，好度朋散古者已了動山，間他成金日；`
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
