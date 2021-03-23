import React, { useCallback, useEffect, useState } from 'react';
import router from 'next/router';
import { useRxAsync } from 'use-rx-hooks';
import { Card } from '@blueprintjs/core';
import { ButtonPopover, ButtonPopoverProps } from '@/components/ButtonPopover';
import { GoBackButton } from '@/components/GoBackButton';
import { ClientHeader, HeaderProps } from '@/components/client/ClientLayout';
import { openConfirmDialog } from '@/components/ConfirmDialog';
import { BugReportStatusTag } from '@/components/Tags';
import { bugReportTypelabels } from '@/components/Select';
import { deleteBugReport, getBugReport, updateBugReport } from '@/service';
import { BugReportStatus, Schema$BugReport, UserRole } from '@/typings';
import { Toaster } from '@/utils/toaster';
import { useClientReportDialog } from './useClientReportDialog';
import classes from './ClientReports.module.scss';
import { useAuthState } from '@/hooks/useAuth';

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

const openDeleteBugReportDialog = (report: Schema$BugReport) => {
  return new Promise<void>((resolve, reject) => {
    openConfirmDialog({
      intent: 'danger',
      icon: 'trash',
      title: '刪除問題/建議',
      children: `確認刪除「${report.title}」嗎？`,
      onConfirm: () =>
        deleteBugReport(report.id)
          .then(() => resolve())
          .catch(reject)
    });
  });
};

export function ClientReportDetail({ reportId }: ClientReportDetailProps) {
  const [report, setReport] = useState<Schema$BugReport | null>(null);
  const [, { fetch }] = useRxAsync(getBugReport, { onSuccess: setReport });
  const { user } = useAuthState();

  const onSuccess = useCallback((report: Schema$BugReport) => {
    setReport(report);
    router.push({ query: { update: JSON.stringify(report) } }, router.asPath);
  }, []);

  const openReportDialog = useClientReportDialog({
    request: updateBugReport,
    onSuccess
  });

  let headerProps: HeaderProps = {};
  let content: React.ReactNode = null;

  if (report) {
    const buttons: ButtonPopoverProps[] =
      user?.role === UserRole.Root ||
      user?.role === UserRole.Admin ||
      user?.nickname === report.user
        ? [
            {
              icon: 'edit',
              content: '編輯',
              onClick: () =>
                openReportDialog({
                  initialValues: report,
                  status: report.status
                })
            },
            {
              icon: 'trash',
              content: '刪除',
              onClick: () =>
                openDeleteBugReportDialog(report)
                  .then(() =>
                    router.push(
                      {
                        pathname: '/reports',
                        query: { deletedReportId: report.id }
                      },
                      '/reports'
                    )
                  )
                  .catch(error => Toaster.apiError('刪除問題/建議失敗', error))
            }
          ]
        : [];

    headerProps = {
      ...headerProps,
      title: report.title,
      left: <GoBackButton targetPath="/reports" />,
      right: buttons.map((props, idx) => (
        <ButtonPopover {...props} key={String(idx)} minimal />
      ))
    };

    content = (
      <div className={classes['detial-content']}>
        <Card className={classes['detial-content-head']}>
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
          <div className={classes['detial-content-desc']}>
            <div>描述:</div>
            <div>{report.description}</div>
          </div>
        </Card>
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
