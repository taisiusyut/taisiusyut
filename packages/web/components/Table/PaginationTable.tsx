import React, { useRef } from 'react';
import { TableInstance } from 'react-table';
import { Spinner } from '@blueprintjs/core';
import { Table, TableProps } from './Table';
import { Pagination, PaginationProps } from '../Pagination';
import classes from './Table.module.scss';

export interface PaginationTableProps<T extends {}> extends TableProps<T> {
  pagination?: PaginationProps;
  loading?: boolean;
}

export function PaginationTable<T extends {}>({
  pagination,
  loading,
  data,
  className = '',
  ...props
}: PaginationTableProps<T>) {
  const { onPageChange = () => void 0, ...paginateProps } = pagination || {};
  const ref = useRef<TableInstance<T>>(null);

  return (
    <Table
      {...(props as any)}
      ref={ref}
      data={data}
      initialState={{
        pageIndex: (pagination?.pageNo || 1) - 1,
        pageSize: pagination?.size
      }}
      className={`${classes['pagination-table']} ${className}`.trim()}
    >
      {!loading && data.length === 0 && null}
      {loading && (
        <div className="loading">
          <Spinner size={40} />
        </div>
      )}
      <Pagination
        {...paginateProps}
        onPageChange={page => {
          onPageChange(page);
          ref.current?.gotoPage(page - 1);
        }}
      />
    </Table>
  );
}
