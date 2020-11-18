import React from 'react';
import { Tag } from '@blueprintjs/core';
import { Schema$Book, BookStatus, Order, Category } from '@/typings';
import { Table, TableProps, SortableHeader } from '@/components/Table';
import classes from './Books.module.scss';
import dayjs from 'dayjs';

type Props = TableProps<Schema$Book>;
type Columns = Props['columns'];

const bookColumns: Columns = [
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
    id: 'category',
    Header: 'Category',
    accessor: book => Category[book.category]
  },
  {
    id: 'tags',
    Header: 'Tags',
    accessor: book => (
      <div style={{ width: 300, whiteSpace: 'break-spaces' }}>
        {book.tags.map((tag, i) => (
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

export function BooksTable(props: Omit<Props, 'columns'>) {
  return <Table {...props} columns={bookColumns} />;
}
