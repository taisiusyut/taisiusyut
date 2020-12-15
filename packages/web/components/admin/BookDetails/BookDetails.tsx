import React, { useState } from 'react';
import router from 'next/router';
import { Card, Button } from '@blueprintjs/core';
import { createFilter } from '@/components/Filter';
import { PageHeader } from '@/components/admin/PageHeader';
import { ChapterStatusSelect, ChapterTypeSelect } from '@/components/Select';
import { useAuthState } from '@/hooks/useAuth';
import {
  createUsePaginationLocal,
  DefaultCRUDActionTypes
} from '@/hooks/usePaginationLocal';
import { UserRole, Schema$Book, Param$GetChapters } from '@/typings';
import { getChapters } from '@/service';
import { Toaster } from '@/utils/toaster';
import { BookDetailsHeader, OnUpdate } from './BookDetailsHeader';
import { ChapterTable } from './ChapterTable';
import classes from './BookDetails.module.scss';

interface Props extends OnUpdate {
  book: Partial<Schema$Book> & Pick<Schema$Book, 'id'>;
}

const {
  Filter,
  FilterInput,
  FilterDateRange,
  FormItem //
} = createFilter<Param$GetChapters>();

const onFailure = Toaster.apiError.bind(Toaster, `Get chapters failure`);

const gotoChapter = (bookID: string, chapterID?: string) => {
  let pathname = `/admin/book/${bookID}/chapters`;
  if (chapterID) {
    pathname += `/${chapterID}`;
  }
  return router.push(pathname);
};

export function BookDetails({ book, onUpdate }: Props) {
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
            payload: Array.from({ length: 10 }).map(() => ({
              id: String(Math.random())
            }))
          })
      }
    )
  );

  const { state, pagination } = useChapters({ onFailure });

  const isAuthor = user?.role === UserRole.Author;

  return (
    <div>
      <BookDetailsHeader book={book} role={user?.role} onUpdate={onUpdate} />
      <Card className={classes.chapters}>
        <PageHeader title="Chapters">
          {isAuthor && (
            <Button minimal icon="plus" onClick={() => gotoChapter(book.id)} />
          )}
        </PageHeader>

        <Filter initialValues={state.params} className={classes.filter}>
          <FilterInput name="id" label="Chapter ID" />
          <FilterInput name="name" label="Name" />
          <FormItem name="status" label="Status">
            <ChapterStatusSelect />
          </FormItem>
          <FormItem name="type" label="Type">
            <ChapterTypeSelect />
          </FormItem>
          <FilterDateRange name="createdAt" label="Created At" />
          <FilterDateRange name="updatedAt" label="Updated At" />
        </Filter>

        <ChapterTable
          pagination={pagination}
          data={state.list}
          onRowClick={
            isAuthor
              ? row => {
                  const chapterID = row.original.id;
                  return chapterID && gotoChapter(book.id, chapterID);
                }
              : undefined
          }
        />
      </Card>
    </div>
  );
}
