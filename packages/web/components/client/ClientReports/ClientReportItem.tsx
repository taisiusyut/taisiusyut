import { BugReportStatusTag } from '@/components/Tags';
import { Schema$BugReport } from '@/typings';
import classes from './ClientReports.module.scss';
import dayjs from 'dayjs';
import { Skelecton } from '@/components/Skelecton';

export type BugReport = Partial<Schema$BugReport> & { id: string };

export interface ClientReportItemProps {
  report: Partial<BugReport>;
}

export function ClientReportItem({ report }: ClientReportItemProps) {
  const { title, status, updatedAt, description } = report;

  return (
    <div className={classes['item']}>
      <div className={classes['item-header']}>
        <div className={classes['item-status']}>
          <Skelecton length={1}>
            {status && <BugReportStatusTag status={status} />}
          </Skelecton>
        </div>
        <Skelecton length={2}>{title}</Skelecton>
      </div>

      <div className={classes['item-description']}>
        <Skelecton length={18}>{description}</Skelecton>
      </div>

      <div className={classes['item-date']}>
        <Skelecton length={3}>
          {updatedAt && `更新時間: ${dayjs(updatedAt).fromNow()}`}
        </Skelecton>
      </div>
    </div>
  );
}
