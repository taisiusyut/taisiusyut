import { BugReportStatusTag } from '@/components/Tags';
import { Schema$BugReport } from '@/typings';
import classes from './ClientReports.module.scss';
import dayjs from 'dayjs';

export type BugReport = Partial<Schema$BugReport> & { id: string };

export interface ClientReportItemProps {
  report: Partial<BugReport>;
}

export function ClientReportItem({ report }: ClientReportItemProps) {
  const { title, status, updatedAt, description } = report;

  return (
    <div className={classes['item']}>
      <div className={classes['item-body']}>
        <div className={classes['item-content']}>
          <div className={classes['item-title']}>{title}</div>
          <div className={classes['item-description']}>{description}</div>
          <div className={classes['item-date']}>
            更新時間: {dayjs(updatedAt).fromNow()}
          </div>
        </div>
        <div>
          <BugReportStatusTag status={status} />
        </div>
      </div>
    </div>
  );
}
