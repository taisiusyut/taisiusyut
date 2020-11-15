import React, { ReactNode, MouseEvent, useEffect } from 'react';
import {
  useTable,
  usePagination,
  TableOptions,
  useRowSelect,
  Row
} from 'react-table';
import { HTMLTable } from '@blueprintjs/core';
import { Pagination, PaginationProps } from '@/components/Pagination';
import { NotFound } from '@/components/NotFound';
import classes from './Table.module.scss';

export * from 'react-table';

export interface TableProps<T extends {}> extends TableOptions<T> {
  className?: string;
  children?: ReactNode;
  pagination?: PaginationProps;
  loading?: boolean;
  rowSelectedClassName?: string;
  onRowClick?: (row: Row<T>, event: MouseEvent<HTMLTableRowElement>) => void;
}

export function Table<T extends {}>({
  className = '',
  children,
  pagination,
  loading,
  onRowClick,
  rowSelectedClassName,
  ...props
}: TableProps<T>) {
  const { onPageChange = () => void 0, pageSize, ...paginationProps } =
    pagination || {};

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    gotoPage,
    setPageSize
  } = useTable(
    {
      ...props,
      initialState: {
        pageIndex: (pagination?.pageNo || 1) - 1,
        pageSize: pagination?.pageSize
      }
    },
    usePagination,
    useRowSelect
  );

  useEffect(() => {
    if (typeof pageSize === 'number') {
      setPageSize(pageSize);
    }
  }, [setPageSize, pageSize]);

  return (
    <div className={`${classes.table} ${className}`.trim()}>
      <HTMLTable
        {...getTableProps()}
        interactive={typeof onRowClick === 'function'}
      >
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
              <tr
                {...row.getRowProps()}
                className={row.isSelected ? rowSelectedClassName : undefined}
                onClick={event => onRowClick && onRowClick(row, event)}
              >
                {row.cells.map(cell => (
                  <td {...cell.getCellProps()} className={classes.td}>
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </HTMLTable>

      {!loading && page.length === 0 && <NotFound />}

      <Pagination
        {...paginationProps}
        pageSize={pageSize}
        onPageChange={page => {
          gotoPage(page - 1);
          onPageChange(page);
        }}
      />
    </div>
  );
}
