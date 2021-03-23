import React from 'react';
import { Schema$Chapter } from '@/typings';
import { Table, TableProps, SortableHeader, Column } from '@/components/Table';
import { ChapterStatusTag } from '@/components/Tags';
import dayjs from 'dayjs';

type BookTableProps = Omit<TableProps<Partial<Schema$Chapter>>, 'columns'> & {};

const chapterColumns: Column<Partial<Schema$Chapter>>[] = [
  {
    id: 'number',
    Header: 'No.',
    accessor: chapter => chapter.number
  },
  {
    id: 'name',
    accessor: 'name',
    Header: '名稱'
  },
  {
    id: 'status',
    Header: '狀態',
    accessor: ({ status }) => <ChapterStatusTag status={status} />
  },
  {
    id: 'createdAt',
    accessor: ({ createdAt }) =>
      createdAt && dayjs(createdAt).format('YYYY-MM-DD HH:mm:ss'),
    Header: () => <SortableHeader field="createdAt">創建時間</SortableHeader>
  },
  {
    id: 'updatedAt',
    accessor: ({ updatedAt }) =>
      updatedAt && dayjs(updatedAt).format('YYYY-MM-DD HH:mm:ss'),
    Header: () => <SortableHeader field="updatedAt">更新時間</SortableHeader>
  }
];

export function ChapterTable(props: BookTableProps) {
  return <Table {...props} columns={chapterColumns} />;
}
