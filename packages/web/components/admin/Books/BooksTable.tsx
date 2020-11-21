import React from 'react';
import { Schema$Book, Order, Category } from '@/typings';
import { Table, TableProps, SortableHeader, Column } from '@/components/Table';
import { BookModel } from '@/components/BookModel';
import { Tags, BookStatusTag } from '@/components/Tags';
import dayjs from 'dayjs';

type BookTableProps = Omit<TableProps<Partial<Schema$Book>>, 'columns'> & {
  isAuthor: boolean;
};

const bookColumns: Column<Partial<Schema$Book>>[] = [
  {
    id: 'cover',
    Header: 'Cover',
    accessor: book => {
      const width = 60;
      return (
        <div style={{ width, margin: `5px 5px 5px 10px` }}>
          <BookModel cover={book.cover} width={width} key={book.cover} />
        </div>
      );
    }
  },
  {
    id: 'name',
    accessor: 'name',
    Header: 'Name'
  },
  {
    id: 'status',
    Header: 'Status',
    accessor: ({ status }) => <BookStatusTag status={status} />
  },
  {
    id: 'author',
    Header: 'Author',
    accessor: book => {
      return book.author?.nickname;
    }
  },
  {
    id: 'category',
    Header: 'Category',
    accessor: book => book.category && Category[book.category]
  },
  {
    id: 'tags',
    Header: 'Tags',
    accessor: book => (
      <div style={{ maxWidth: 200, whiteSpace: 'break-spaces' }}>
        <Tags tags={book.tags || []} />
      </div>
    )
  },
  {
    id: 'createdAt',
    accessor: ({ createdAt }) =>
      createdAt && dayjs(createdAt).format('YYYY-MM-DD HH:mm:ss'),
    Header: () => (
      <SortableHeader field="createdAt" defaultOrder={Order.DESC}>
        Created At
      </SortableHeader>
    )
  },
  {
    id: 'updatedAt',
    accessor: ({ updatedAt }) =>
      updatedAt && dayjs(updatedAt).format('YYYY-MM-DD HH:mm:ss'),
    Header: () => (
      <SortableHeader field="updatedAt" defaultOrder={Order.DESC}>
        Updated At
      </SortableHeader>
    )
  }
];

const bookColumnsForAuthor = bookColumns.filter(col => col.id !== 'author');

export function BooksTable({ isAuthor, ...props }: BookTableProps) {
  return (
    <Table {...props} columns={isAuthor ? bookColumnsForAuthor : bookColumns} />
  );
}
