import React, { useEffect } from 'react';
import {
  useTable,
  usePagination,
  TableOptions,
  useRowSelect,
  Row
} from 'react-table';
import { Divider, HTMLTable } from '@blueprintjs/core';
import { Pagination, PaginationProps } from '@/components/Pagination';
import { NotFound } from '@/components/NotFound';
import classes from './Table.module.scss';

export * from 'react-table';

export interface TableProps<T extends {}> extends TableOptions<T> {
  className?: string;
  children?: React.ReactNode;
  pagination?: PaginationProps;
  loading?: boolean;
  rowSelectedClassName?: string;
  onRowClick?: (
    row: Row<T>,
    event: React.MouseEvent<HTMLTableRowElement>
  ) => void;
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
  const { onPageChange = () => void 0, pageNo, pageSize } = pagination || {};

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    data,
    state,
    gotoPage,
    setPageSize
  } = useTable(
    {
      ...props,
      initialState: {
        pageIndex: (pageNo || 1) - 1,
        pageSize: pageSize || 10
      }
    },
    usePagination,
    useRowSelect
  );

  useEffect(() => {
    gotoPage((pageNo || 1) - 1);
  }, [gotoPage, pageNo]);

  useEffect(() => {
    setPageSize(pageSize || 10);
  }, [setPageSize, pageSize]);

  return (
    <div className={`${classes['table']} ${className}`.trim()}>
      <div className={classes['table-content']}>
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
                    <td {...cell.getCellProps()} className={classes['td']}>
                      {cell.render('Cell')}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </HTMLTable>

        {!loading && page.length === 0 && <NotFound />}
      </div>

      {!!page.length && (
        <>
          <Divider className={classes['divider']} />

          <Pagination
            total={data.length}
            pageNo={state.pageIndex + 1}
            pageSize={state.pageSize}
            onPageChange={onPageChange}
          />
        </>
      )}
    </div>
  );
}
