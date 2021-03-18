import dayjs from 'dayjs';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { BugReportStatusTag } from '@/components/Tags';
import { Skelecton } from '@/components/Skelecton';
import { Schema$BugReport } from '@/typings';
import classes from './ClientReports.module.scss';

export type BugReport = Partial<Schema$BugReport> & { id: string };

export interface ClientReportItemProps {
  report: Partial<BugReport>;
}

export function ClientReportItem({ report }: ClientReportItemProps) {
  const { asPath } = useRouter();

  const { id, title, status, updatedAt, description } = report;

  const className = classes['item'];

  const content = (
    <>
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
    </>
  );

  if (id && title) {
    const basePath = `/reports/${id}`;
    const active = decodeURIComponent(asPath).startsWith(basePath);
    return (
      <Link href={basePath} prefetch={false}>
        <div
          className={[className, active ? classes['active'] : '']
            .join(' ')
            .trim()}
        >
          {content}
        </div>
      </Link>
    );
  }

  return <div className={classes['item']}>{content}</div>;
}
