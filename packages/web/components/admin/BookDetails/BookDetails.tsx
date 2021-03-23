import React, { useState } from 'react';
import { Card } from '@blueprintjs/core';
import { createFilter } from '@/components/Filter';
import { BookInfoCard } from '@/components/BookInfoCard';
import { PageHeader } from '@/components/admin/PageHeader';
import { ChapterStatusSelect, ChapterTypeSelect } from '@/components/Select';
import { ButtonPopover } from '@/components/ButtonPopover';
import { useAuthState } from '@/hooks/useAuth';
import {
  createUsePaginationLocal,
  DefaultCRUDActionTypes
} from '@/hooks/usePaginationLocal';
import { UserRole, Param$GetChapters, Schema$Chapter } from '@/typings';
import { getChapters } from '@/service';
import { Toaster } from '@/utils/toaster';
import { BookActions, BookActionsProps } from '../BookActions';
import { ChapterTable } from './ChapterTable';
import { openChapterMenu, gotoChapter } from './ChapterMenu';
import classes from './BookDetails.module.scss';

interface Props extends BookActionsProps {}

const {
  Filter,
  FilterInput,
  FilterDateRange,
  FormItem //
} = createFilter<Param$GetChapters>();

const onFailure = Toaster.apiError.bind(Toaster, `Get chapters failure`);

export function BookDetails({ book, onSuccess }: Props) {
  const { user } = useAuthState();
  const [useChapters] = useState(() =>
    createUsePaginationLocal(
      'id',
      (params?: Param$GetChapters) =>
        getChapters({ ...params, bookID: book.id, timestamp: true }),
      {
        initializer: (state, reducer) =>
          reducer(state, {
            type: DefaultCRUDActionTypes.PAGINATE,
            payload: Array.from({ length: 10 }, () => ({
              id: String(Math.random())
            }))
          })
      }
    )
  );

  const { state, actions, pagination } = useChapters({ onFailure });

  const isAuthor = user?.role === UserRole.Author;

  return (
    <div>
      <Card>
        <PageHeader targetPath={`/admin/book`} title="書籍詳情">
          <BookActions book={book} onSuccess={onSuccess} role={user?.role} />
        </PageHeader>
      </Card>

      <BookInfoCard
        book={book}
        author={!isAuthor}
        className={classes['info']}
      />

      <Card className={classes['chapters']}>
        <PageHeader title="章節列表">
          {isAuthor && (
            <ButtonPopover
              minimal
              icon="plus"
              content="新增章節"
              onClick={() => gotoChapter(book.id)}
            />
          )}
        </PageHeader>

        <Filter initialValues={state.params} className={classes['filter']}>
          <FilterInput name="id" label="章節ID" />
          <FilterInput name="name" label="名稱" />
          <FormItem name="status" label="狀態">
            <ChapterStatusSelect />
          </FormItem>
          <FormItem name="type" label="類型">
            <ChapterTypeSelect />
          </FormItem>
          <FilterDateRange name="createdAt" label="創建時間" />
          <FilterDateRange name="updatedAt" label="更新時間" />
        </Filter>

        <ChapterTable
          data={state.list}
          pagination={pagination}
          onRowClick={(row, event) => {
            row.toggleRowSelected();
            if (Object.keys(row.original).length > 0) {
              openChapterMenu({
                actions,
                bookID: book.id,
                title: row.original.name,
                offset: { top: event.pageY, left: event.pageX },
                onClose: () => row.toggleRowSelected(),
                chapter: row.original as Schema$Chapter
              });
            }
          }}
        />
      </Card>
    </div>
  );
}
