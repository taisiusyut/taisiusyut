import React from 'react';
import { Card, H4 } from '@blueprintjs/core';
import { useAuthState } from '@/hooks/useAuth';
import { createUsePaginationLocal } from '@/hooks/usePaginationLocal';
import { Order, UserRole, Schema$Book } from '@/typings';
import { getBooks } from '@/service';
import { Toaster } from '@/utils/toaster';
import { CreateBook } from './CreateBook';
import { BooksTable } from './BooksTable';
import classes from './Books.module.scss';

const useBooks = createUsePaginationLocal<Schema$Book, 'id'>('id', getBooks);

const onFailure = Toaster.apiError.bind(Toaster, 'Get books Failure');

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

      <BooksTable data={state.list} loading={loading} pagination={pagination} />
    </Card>
  );
}
