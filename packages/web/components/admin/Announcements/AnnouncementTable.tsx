import React, { useMemo } from 'react';
import { Tag } from '@blueprintjs/core';
import { AnnouncementType, Schema$Announcement } from '@/typings';
import { Table, TableProps, SortableHeader } from '@/components/Table';
import { OnUpdate, UpdateAnnouncement } from './UpdateAnnouncement';
import { OnDelete, DeleteAnnouncement } from './DeleteAnnouncement';
import dayjs from 'dayjs';

type Props = TableProps<Partial<Schema$Announcement>> & OnUpdate & OnDelete;
type Columns = Props['columns'];

const announcemenColumns: Columns = [
  {
    id: 'status',
    Header: '狀態',
    accessor: ({ end }) =>
      end &&
      (end > +new Date() ? (
        <Tag intent="success">Active</Tag>
      ) : (
        <Tag intent="none" minimal>
          InActive
        </Tag>
      ))
  },
  {
    id: 'title',
    accessor: 'title',
    Header: '標題'
  },
  {
    id: 'type',
    Header: '類型',
    accessor: ({ type }) => type && AnnouncementType[type]
  },
  {
    id: 'start',
    Header: () => <SortableHeader field="start">開始日期</SortableHeader>,
    accessor: ({ start }) => start && dayjs(start).format('YYYY-MM-DD HH:mm:ss')
  },
  {
    id: 'end',
    Header: () => <SortableHeader field="end">結束日期</SortableHeader>,
    accessor: ({ end }) => end && dayjs(end).format('YYYY-MM-DD HH:mm:ss')
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

export function AnnouncementTable({
  onUpdate,
  onDelete,
  ...props
}: Omit<Props, 'columns'>) {
  const columns = useMemo<Columns>(
    () => [
      ...announcemenColumns,
      {
        id: 'action',
        Header: 'Actions',
        accessor: payload =>
          payload.id &&
          payload.title && (
            <>
              <UpdateAnnouncement
                data={payload as Schema$Announcement}
                onUpdate={onUpdate}
              />
              <DeleteAnnouncement id={payload.id} onDelete={onDelete} />
            </>
          )
      }
    ],
    [onUpdate, onDelete]
  );
  return <Table {...props} columns={columns} />;
}
