import React from 'react';
import { Card, H4 } from '@blueprintjs/core';
import { useAuthState } from '@/hooks/useAuth';
import { createUsePaginationLocal } from '@/hooks/usePaginationLocal';
import { createFilter } from '@/components/Filter';
import { BookStatusSelect, CategorySelect } from '@/components/Select';
import { Order, UserRole, Schema$Book, Param$GetBooks } from '@/typings';
import { getBooks } from '@/service';
import { Toaster } from '@/utils/toaster';
import { CreateBook } from './CreateBook';
import { BooksTable } from './BooksTable';
import classes from './Books.module.scss';

const useBooks = createUsePaginationLocal<Schema$Book, 'id'>('id', getBooks);

const onFailure = Toaster.apiError.bind(Toaster, 'Get books Failure');

const {
  FormItem,
  Filter,
  FilterInput,
  FilterDateRange //
} = createFilter<Param$GetBooks>();

export function Books() {
  const { user } = useAuthState();
  const { state, actions, loading, pagination } = useBooks({ onFailure });
  const { sort = { createdAt: Order.DESC } } = state.params;

  return (
    <Card>
      <div className={classes.header}>
        <H4>Books</H4>
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
      </div>

      <Filter initialValues={state.params} className={classes.fitler}>
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
        onRowClick={() => void 0}
      />
    </Card>
  );
}
