import React from 'react';
import { useRxAsync } from 'use-rx-hooks';
import { GoBackButton } from '@/components/GoBackButton';
import { ClientHeader, HeaderProps } from '@/components/client/ClientLayout';
import { BugReportStatusTag } from '@/components/Tags';
import { bugReportTypelabels } from '@/components/Select';
import { getBugReport } from '@/service';
import { useEffect, useState } from 'react';
import { BugReportStatus, Schema$BugReport } from '@/typings';
import classes from './ClientReports.module.scss';

export interface ClientReportDetailProps {
  reportId: string | null;
}

const Item: React.FC<{ label: string }> = ({ label, children }) => {
  return (
    <div className={classes['detial-content-item']}>
      <div className={classes['detial-content-item-label']}>{label}</div>
      {children}
    </div>
  );
};

export function ClientReportDetail({ reportId }: ClientReportDetailProps) {
  const [report, setReport] = useState<Schema$BugReport | null>(null);
  const [, { fetch }] = useRxAsync(getBugReport, { onSuccess: setReport });

  let headerProps: HeaderProps = {};
  let content: React.ReactNode = null;

  if (report) {
    headerProps = {
      ...headerProps,
      title: report.title,
      left: <GoBackButton targetPath="/reports" />
    };

    content = (
      <div className={classes['detial-content']}>
        <div className={classes['detial-content-head']}>
          <Item label="狀態">
            <BugReportStatusTag status={report.status} />
          </Item>
          <Item label="類型">{bugReportTypelabels[report.type]}</Item>
          <Item
            label={
              report.status === BugReportStatus.Fixed
                ? '已修復版本'
                : '受影響版本'
            }
          >
            {report.version}
          </Item>
        </div>
        <div className={classes['detial-content-desc']}>
          <div>描述:</div>
          <div>{report.description}</div>
        </div>
      </div>
    );
  }

  useEffect(() => {
    if (reportId) {
      fetch(reportId);
    }
    setReport(null);
  }, [fetch, reportId]);

  return (
    <>
      <ClientHeader {...headerProps} />
      {content}
    </>
  );
}
