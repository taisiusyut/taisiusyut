import React, { useState } from 'react';
import Link from 'next/link';
import {
  Order,
  PaginateResult,
  Param$GetChapters,
  Schema$Chapter
} from '@/typings';
import { Card, Classes, Divider, Tag } from '@blueprintjs/core';
import { Pagination } from '@/components/Pagination';
import {
  createUsePaginationLocal,
  DefaultCRUDActionTypes
} from '@/hooks/usePaginationLocal';
import { getChapters } from '@/service';
import { Toaster } from '@/utils/toaster';
import classes from './ClientBookChaptersGrid.module.scss';

interface Props {
  bookID: string;
  bookName: string;
  chapters?: Pick<PaginateResult<Partial<Schema$Chapter>>, 'data' | 'pageSize'>;
}

interface ChaptersGridProps {
  bookName?: string;
  children?: React.ReactNode;
  chapters: Partial<Schema$Chapter>[];
}

// TODO: empty chapter

const onFailure = Toaster.apiError.bind(Toaster, `Get chapters failure`);

const itemClassName = [Classes.MENU_ITEM, classes['chapter-item']].join(' ');

export function ChaptersGrid({
  bookName,
  chapters,
  children
}: ChaptersGridProps) {
  const maxLength = String(chapters.slice(-1)[0]?.number || '').length;

  return (
    <Card className={classes['grid-container']}>
      <div className={classes['head']}>章節目錄</div>
      <div className={classes['grid']}>
        {chapters.map(chapter => {
          const content = (
            <>
              <Tag minimal className={classes['tag']}>
                {String(chapter.number || '').padStart(maxLength, '0')}
              </Tag>
              <span className={classes['chapter-name']}>{chapter.name}</span>
            </>
          );

          if (bookName) {
            return (
              <Link
                key={chapter.id}
                href={`/book/${bookName}/chapter/${chapter.number}`}
              >
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a className={itemClassName}>{content}</a>
              </Link>
            );
          }

          return (
            <div key={chapter.id} className={itemClassName}>
              {content}
            </div>
          );
        })}
      </div>
      {children}
    </Card>
  );
}

export function ClientBookChaptersGrid({
  bookID,
  bookName,
  chapters: initialChapters
}: Props) {
  const [useChapters] = useState(() => {
    const request = (params?: Param$GetChapters) =>
      getChapters({ ...params, bookID, sort: { createdAt: Order.ASC } });
    return createUsePaginationLocal('id', request, {
      defaultState: { pageSize: initialChapters?.pageSize },
      initializer: (state, reducer) => ({
        ...reducer(state, {
          type: DefaultCRUDActionTypes.PAGINATE,
          payload: initialChapters
        })
      })
    });
  });
  const { data, pagination } = useChapters({ onFailure });

  return (
    <ChaptersGrid chapters={data} bookName={bookName}>
      <div className={classes['spacer']} />
      <Divider className={classes['divider']} />
      <Pagination {...pagination} />
    </ChaptersGrid>
  );
}
