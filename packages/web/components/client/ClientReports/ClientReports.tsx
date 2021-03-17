import React, { useEffect } from 'react';
import { ClientHeader } from '@/components/client/ClientLayout';
import { ButtonPopover } from '@/components/ButtonPopover';
import { openMixedConfirmOverlay } from '@/components/MixedOverlay';
import { createBugReport, getBugReport } from '@/service';
import {
  createUseCRUDReducer,
  DefaultCRUDActionTypes
} from '@/hooks/crud-reducer';
import { ClientReportWarning } from './ClientReportWarning';
import { ClientReportForm, useForm } from './ClientReportForm';
import { BugReport, ClientReportItem } from './ClientReportItem';
import classes from './ClientReports.module.scss';

export interface ClientReportsProps {
  onLeave: () => void;
}

const icon = 'annotation';
const title = '問題/建議';

const pageSize = 10;
const placeholder = Array.from<void, BugReport>(
  { length: pageSize },
  (_, idx) => ({
    id: String(idx)
  })
);

const useBugReports = createUseCRUDReducer<BugReport, 'id'>('id', {
  initializer: (state, reducer) =>
    reducer(
      { ...state, pageSize },
      { type: DefaultCRUDActionTypes.LIST, payload: placeholder }
    )
});

export function ClientReports({ onLeave }: ClientReportsProps) {
  const [form] = useForm();
  const [state, actions] = useBugReports();

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

  useEffect(() => {
    async function fetch() {
      try {
        const response = await getBugReport();
        actions.paginate(response);
      } catch (error) {
        //
      }
    }
    fetch();
  }, [actions]);

  return (
    <div className={classes['client-reports']}>
      <ClientHeader title={title} left={cloeButton} right={newReportButton} />
      <div>
        {state.list.map(report => (
          <ClientReportItem key={report.id} report={report} />
        ))}
      </div>
    </div>
  );
}
