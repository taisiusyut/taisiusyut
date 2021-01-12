import React from 'react';
import { Schema$Chapter, ChapterType } from '@/typings';
import { Table, TableProps, SortableHeader, Column } from '@/components/Table';
import { ChapterStatusTag } from '@/components/Tags';
import dayjs from 'dayjs';

type BookTableProps = Omit<TableProps<Partial<Schema$Chapter>>, 'columns'> & {};

const chapterColumns: Column<Partial<Schema$Chapter>>[] = [
  {
    id: 'number',
    Header: 'Number',
    accessor: chapter => chapter.number
  },
  {
    id: 'name',
    accessor: 'name',
    Header: 'Name'
  },
  {
    id: 'status',
    Header: 'Status',
    accessor: ({ status }) => <ChapterStatusTag status={status} />
  },
  {
    id: 'type',
    Header: 'Type',
    accessor: ({ type }) => type && ChapterType[type]
  },
  {
    id: 'price',
    Header: 'Price',
    accessor: chapter =>
      Object.keys(chapter).length
        ? chapter.price || <div>&nbsp;&nbsp;&nbsp;-</div>
        : null
  },
  {
    id: 'createdAt',
    accessor: ({ createdAt }) =>
      createdAt && dayjs(createdAt).format('YYYY-MM-DD HH:mm:ss'),
    Header: () => <SortableHeader field="createdAt">Created At</SortableHeader>
  },
  {
    id: 'updatedAt',
    accessor: ({ updatedAt }) =>
      updatedAt && dayjs(updatedAt).format('YYYY-MM-DD HH:mm:ss'),
    Header: () => <SortableHeader field="updatedAt">Updated At</SortableHeader>
  }
];

export function ChapterTable(props: BookTableProps) {
  return <Table {...props} columns={chapterColumns} />;
}
