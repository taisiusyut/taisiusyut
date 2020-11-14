import React, { ReactNode, Ref, useImperativeHandle } from 'react';
import {
  useTable,
  usePagination,
  TableOptions,
  TableInstance
} from 'react-table';
import { HTMLTable } from '@blueprintjs/core';
import classes from './Table.module.scss';

export * from 'react-table';

export interface TableProps<T extends {}> extends TableOptions<T> {
  className?: string;
  children?: ReactNode;
}

function TableComponent<T extends {}>(
  { className = '', children, ...props }: TableProps<T>,
  ref?: Ref<TableInstance<T>>
) {
  const state = useTable(props, usePagination);
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow
  } = state;

  useImperativeHandle(ref, () => state);

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
          {page.map(row => {
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

export const Table = React.forwardRef(TableComponent);
