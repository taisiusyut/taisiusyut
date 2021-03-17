import React from 'react';
import { ClientHeader } from '@/components/client/ClientLayout';
import { ButtonPopover } from '@/components/ButtonPopover';
import { openMixedConfirmOverlay } from '@/components/MixedOverlay';
import { createBugReport } from '@/service';
import { ClientReportWarning } from './ClientReportWarning';
import { ClientReportForm, useForm } from './ClientReportForm';
import classes from './ClientReports.module.scss';

export interface ClientReportsProps {
  onLeave: () => void;
}

const icon = 'annotation';
const title = '問題/建議';

export function ClientReports({ onLeave }: ClientReportsProps) {
  const [form] = useForm();

  async function submitNewReport() {
    const payload = await form.validateFields();
    await createBugReport(payload);
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
          <ClientReportForm form={form} />
        </>
      )
    });
  };

  const cloeButton = (
    <ButtonPopover minimal icon="cross" content="關閉" onClick={onLeave} />
  );

  const newReportButton = (
    <ButtonPopover minimal icon={icon} content="新增" onClick={openNewReport} />
  );

  return (
    <div className={classes['client-reports']}>
      <ClientHeader title={title} left={cloeButton} right={newReportButton} />
    </div>
  );
}
