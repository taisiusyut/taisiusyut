import React from 'react';
import Image from 'next/image';
import { Tag } from '@blueprintjs/core';
import { Schema$Book, BookStatus, Order, Category } from '@/typings';
import { Table, TableProps, SortableHeader, Column } from '@/components/Table';
import classes from './Books.module.scss';
import dayjs from 'dayjs';

type BookTableProps = Omit<TableProps<Schema$Book>, 'columns'> & {
  isAuthor: boolean;
};

const bookColumns: Column<Schema$Book>[] = [
  {
    id: 'cover',
    Header: 'Cover',
    accessor: book =>
      book.cover && (
        <Image
          src={book.cover}
          layout="fixed"
          width={60}
          height={80}
          unoptimized
        />
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
    accessor: book => book.status && BookStatus[book.status]
  },
  {
    id: 'author',
    Header: 'Author',
    accessor: book => book.author.nickname
  },
  {
    id: 'category',
    Header: 'Category',
    accessor: book => Category[book.category]
  },
  {
    id: 'tags',
    Header: 'Tags',
    accessor: book => (
      <div style={{ width: 300, whiteSpace: 'break-spaces' }}>
        {book.tags?.map((tag, i) => (
          <Tag key={`${tag}-${i}`} className={classes.tag}>
            {tag}
          </Tag>
        ))}
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
