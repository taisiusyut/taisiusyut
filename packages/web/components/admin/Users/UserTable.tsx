import React, { useMemo } from 'react';
import { Button } from '@blueprintjs/core';
import { InsertedUserSchema, UserRole } from '@/typings';
import { PaginationTable, PaginationTableProps } from '@/components/Table';

export type UserData = Partial<InsertedUserSchema> & {
  id: string;
};

type Props = PaginationTableProps<UserData>;
type Columns = Props['columns'];

const userColumns: Columns = [
  {
    Header: 'Username',
    accessor: 'username'
  },
  {
    Header: 'Role',
    accessor: ({ role }) => {
      if (typeof role !== 'undefined') {
        const str = UserRole[role];
        return str[0] + str.slice(1).toLowerCase();
      }
    }
  },
  {
    Header: 'Nickname',
    accessor: 'nickname'
  },
  { Header: 'Email', accessor: 'email' },
  {
    Header: 'Created At',
    accessor: ({ createdAt }) => createdAt
  }
];

export function UserTable(props: Omit<Props, 'columns'>) {
  const columns = useMemo(
    () => [
      ...userColumns,
      {
        Header: 'Actions',
        accessor: () => <Button text="Action" />
      }
    ],
    []
  );

  return <PaginationTable {...props} columns={columns} />;
}
