import React from 'react';
import { ClientHeader } from '@/components/client/ClientLayout';
import { withAuthRequired } from '@/components/client/withAuthRequired';
import { ButtonPopover } from '@/components/ButtonPopover';
import { openMixedConfirmOverlay } from '@/components/MixedOverlay';
import { createBugReport } from '@/service';
import { BugReportType } from '@/typings';
import { ClientReportWarning } from './ClientReportWarning';
import { ClientReportForm, useForm } from './ClientReportForm';
import { ClientReportItem } from './ClientReportItem';
import { useClientReports } from './useClientReports';
import classes from './ClientReports.module.scss';

export interface ClientReportsProps {
  onLeave: () => void;
}

const icon = 'annotation';
const title = '問題/建議';

const AuthRequiredButton = withAuthRequired(ButtonPopover);

export function ClientReports({ onLeave }: ClientReportsProps) {
  const [form] = useForm();
  const { state, actions, scrollerRef } = useClientReports();

  async function submitNewReport() {
    const payload = await form.validateFields();
    const report = await createBugReport(payload);
    actions.insert(report, 0);
  }

  const openNewReport = () => {
    form.resetFields();
    openMixedConfirmOverlay({
      icon,
      title,
      style: { width: 400 },
      onConfirm: submitNewReport,
      children: (
        <>
          <ClientReportWarning />
          <ClientReportForm
            form={form}
            initialValues={{
              type: BugReportType.Other,
              title: '廣係綠麼務由',
              description: `深工公治兩社數小成，應怎兩機未角前飛？部她書年長大證男直少哥它總白視所子不北直康起我很市業表，的星場聲部質！的教產林見主；早想臺使化，好度朋散古者已了動山，間他成金日；`
            }}
          />
        </>
      )
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
