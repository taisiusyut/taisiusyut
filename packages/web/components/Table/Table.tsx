import React, { ReactNode, useEffect } from 'react';
import { useTable, usePagination, TableOptions } from 'react-table';
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
  onRowClick?: (data: T) => void;
}

export function Table<T extends {}>({
  className = '',
  children,
  pagination,
  loading,
  onRowClick,
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
    data,
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
    usePagination
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
        striped
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
                onClick={() => onRowClick && onRowClick(row.original)}
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

      {!loading && data.length === 0 && <NotFound />}

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
