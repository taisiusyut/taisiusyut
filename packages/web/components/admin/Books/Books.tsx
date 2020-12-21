import React, { useState } from 'react';
import router from 'next/router';
import { Card } from '@blueprintjs/core';
import { useAuthState } from '@/hooks/useAuth';
import {
  createUsePaginationLocal,
  DefaultCRUDActionTypes
} from '@/hooks/usePaginationLocal';
import { PageHeader } from '@/components/admin/PageHeader';
import { createFilter } from '@/components/Filter';
import { BookStatusSelect, CategorySelect } from '@/components/Select';
import { Order, UserRole, Param$GetBooks } from '@/typings';
import { getBooks } from '@/service';
import { Toaster } from '@/utils/toaster';
import { CreateBook } from './CreateBook';
import { BooksTable } from './BooksTable';
import classes from './Books.module.scss';

const onFailure = Toaster.apiError.bind(Toaster, 'Get books Failure');

const {
  FormItem,
  Filter,
  FilterInput,
  FilterDateRange //
} = createFilter<Param$GetBooks>();

export function Books() {
  const { user } = useAuthState();

  const [useBooks] = useState(() =>
    createUsePaginationLocal(
      'id',
      (params?: Param$GetBooks) =>
        getBooks({
          ...params,
          author: user?.role === UserRole.Author ? user.user_id : undefined
        }),
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

  const { state, actions, loading, pagination } = useBooks({ onFailure });
  const { sort = { createdAt: Order.DESC } } = state.params;

  return (
    <Card>
      <PageHeader title="Books">
        <div className={classes['button-group']}>
          {user?.role === UserRole.Author && (
            <CreateBook
              onCreate={book =>
                actions.insert(
                  book,
                  Number(sort['createdAt']) === Order.ASC
                    ? state.list.length
                    : 0
                )
              }
            />
          )}
        </div>
      </PageHeader>

      <Filter initialValues={state.params} className={classes['fitler']}>
        <FilterInput name="id" label="Book ID" />
        <FilterInput name="name" label="Name" />
        <FilterInput name="tag" label="Tag" />
        {user?.role !== UserRole.Author && (
          <FilterInput name="author" label="Author" />
        )}
        <FormItem name="category" label="Category">
          <CategorySelect />
        </FormItem>
        <FormItem name="status" label="Status">
          <BookStatusSelect />
        </FormItem>
        <FilterDateRange name="createdAt" label="Created At" />
        <FilterDateRange name="updatedAt" label="Updated At" />
      </Filter>

      <BooksTable
        data={state.list}
        loading={loading}
        pagination={pagination}
        isAuthor={user?.role === UserRole.Author}
        onRowClick={row =>
          row.original.id &&
          row.original.name && // true is not placeholder
          router.push(`/admin/book/${row.original.id}`)
        }
      />
    </Card>
  );
}
