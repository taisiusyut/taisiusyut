import React, { useState } from 'react';
import { createFilter } from '@/components/Filter';
import { ChapterStatusSelect, ChapterTypeSelect } from '@/components/Select';
import { useAuthState } from '@/hooks/useAuth';
import { createUsePaginationLocal } from '@/hooks/usePaginationLocal';
import { Schema$Book, Schema$Chapter, Param$GetChapters } from '@/typings';
import { getChapters } from '@/service';
import { BookDetailsHeader, OnUpdate } from './BookDetailsHeader';
import { BookDetailsChapters } from './BookDetailsChapters';
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

export function BookDetails({ book, onUpdate }: Props) {
  const { user } = useAuthState();
  const [useChapters] = useState(() =>
    createUsePaginationLocal<Schema$Chapter, 'id'>(
      'id',
      (params?: Param$GetChapters) =>
        getChapters({ ...params, bookID: book.id }),
      { prefill: false }
    )
  );

  const { state } = useChapters();

  const filter = (
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
  );

  return (
    <div>
      <BookDetailsHeader book={book} role={user?.role} onUpdate={onUpdate} />
      <BookDetailsChapters
        filter={filter}
        bookID={book.id}
        role={user?.role}
        chapters={state.list}
      />
    </div>
  );
}
