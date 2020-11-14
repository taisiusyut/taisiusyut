import React, { ReactNode } from 'react';
import { useTable, TableOptions } from 'react-table';
import { HTMLTable } from '@blueprintjs/core';
import { Order } from '@/typings';
import classes from './Table.module.scss';

export * from 'react-table';

export interface TableProps<T extends {}> extends TableOptions<T> {
  className?: string;
  children?: ReactNode;
  sort?: Partial<Record<string, Order>>;
}

export function Table<T extends {}>({
  className = '',
  children,
  ...props
}: TableProps<T>) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable(props);

  return (
    <div className={`${classes.table} ${className}`.trim()}>
      <HTMLTable {...getTableProps()} striped>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => {
                return (
                  <th {...column.getHeaderProps()}>
                    {column.render('Header')}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </HTMLTable>
      {children}
    </div>
  );
}
