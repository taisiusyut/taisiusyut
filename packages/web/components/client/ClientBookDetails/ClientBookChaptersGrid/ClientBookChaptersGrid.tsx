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
  chapters?: PaginateResult<Schema$Chapter>;
}

// TODO: empty chapter

const onFailure = Toaster.apiError.bind(Toaster, `Get chapters failure`);

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
  const { data: chapters, pagination } = useChapters({ onFailure });
  const maxLength = String(chapters.slice(-1)[0]?.number || '').length;

  return (
    <Card className={classes['grid-container']}>
      <div className={classes['head']}>章節目錄</div>
      <div className={classes['grid']}>
        {chapters.map(chapter => {
          return (
            <Link
              key={chapter.id}
              href={`/book/${bookName}/chapter/${chapter.number}`}
            >
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a
                className={[Classes.MENU_ITEM, classes['chapter-item']].join(
                  ' '
                )}
              >
                <Tag minimal className={classes['tag']}>
                  {chapter.number &&
                    String(chapter.number).padStart(maxLength, '0')}
                </Tag>
                <span className={classes['chapter-name']}>{chapter.name}</span>
              </a>
            </Link>
          );
        })}
      </div>
      <div className={classes['spacer']} />
      <Divider className={classes['divider']} />
      <Pagination {...pagination} />
    </Card>
  );
}
