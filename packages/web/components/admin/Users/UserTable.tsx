import React from 'react';
import { Schema$User, UserRole } from '@/typings';
import { Table, TableProps, SortableHeader } from '@/components/Table';
import { UserStatusTag } from '@/components/Tags';
import dayjs from 'dayjs';

type Props = TableProps<Partial<Schema$User>>;
type Columns = Props['columns'];

const userColumns: Columns = [
  {
    id: 'index',
    accessor: (_, index) => index + 1,
    Header: () => <div style={{ textAlign: 'center' }}>序號</div>,
    Cell: ({ value }: { value: number }) => (
      <div style={{ textAlign: 'center' }}>{value}</div>
    )
  },
  {
    id: 'status',
    accessor: 'status',
    Header: '狀態',
    Cell: ({ value: status }) => {
      return status ? <UserStatusTag status={status} /> : null;
    }
  },
  {
    id: 'username',
    accessor: 'username',
    Header: '用戶名稱'
  },
  {
    id: 'role',
    Header: 'Role',
    accessor: ({ role }) => {
      if (typeof role !== 'undefined') {
        const str = UserRole[role];
        return str[0] + str.slice(1).toLowerCase();
      }
    }
  },
  {
    id: 'nickname',
    accessor: 'nickname',
    Header: '暱稱'
  },
  { Header: '電郵', id: 'email', accessor: 'email' },
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

export function UserTable(props: Omit<Props, 'columns'>) {
  return <Table {...props} columns={userColumns} />;
}
