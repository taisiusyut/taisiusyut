import React from 'react';
import { ITagProps, Tag } from '@blueprintjs/core';
import { Schema$Book, BookStatus, Order, Category } from '@/typings';
import { Table, TableProps, SortableHeader, Column } from '@/components/Table';
import { BookModel } from '@/components/BookModel';
import classes from './Books.module.scss';
import dayjs from 'dayjs';

type BookTableProps = Omit<TableProps<Partial<Schema$Book>>, 'columns'> & {
  isAuthor: boolean;
};

function getTagPropsByStatus(status: BookStatus): ITagProps {
  switch (status) {
    case BookStatus.Public:
      return { intent: 'success' };
    default:
      return { minimal: true };
  }
}

const bookColumns: Column<Partial<Schema$Book>>[] = [
  {
    id: 'cover',
    Header: 'Cover',
    accessor: book => (
      <div style={{ width: 60, margin: `5px 5px 5px 10px` }}>
        <BookModel cover={book.cover} width={60} />
      </div>
    )
  },
  {
    id: 'name',
    accessor: 'name',
    Header: 'Name'
  },
  {
    id: 'status',
    Header: 'Status',
    accessor: ({ status }) =>
      status && <Tag {...getTagPropsByStatus(status)}>{BookStatus[status]}</Tag>
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
        {book.tags && book.tags.length
          ? book.tags.map((tag, i) => (
              <Tag key={`${tag}-${i}`} className={classes.tag}>
                {tag}
              </Tag>
            ))
          : ' - '}
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
