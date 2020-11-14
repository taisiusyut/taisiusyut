import React, { ReactNode } from 'react';
import { HTMLTable } from '@blueprintjs/core';
import { useTable, TableOptions } from 'react-table';
import classes from './Table.module.scss';

export * from 'react-table';

export interface TableProps<T extends Record<string, unknown>>
  extends TableOptions<T> {
  className?: string;
  children?: ReactNode;
}

export function Table<T extends Record<string, unknown>>({
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
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
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
