import React from 'react';
import { Spinner } from '@blueprintjs/core';
import { Table, TableProps } from './Table';
import { Pagination, PaginationProps } from '../Pagination';
import classes from './Table.module.scss';

export interface PaginationTableProps<T extends Record<string, unknown>>
  extends TableProps<T> {
  pagination?: PaginationProps;
  loading?: boolean;
}

export function PaginationTable<T extends Record<string, unknown>>({
  pagination,
  loading,
  data,
  className = '',
  ...props
}: PaginationTableProps<T>) {
  const { onPageChange = () => void 0, ...paginateProps } = pagination || {};
  return (
    <Table
      {...props}
      data={data}
      className={`${classes['pagination-table']} ${className}`.trim()}
    >
      {!loading && data.length === 0 && null}
      {loading && (
        <div className="loading">
          <Spinner size={40} />
        </div>
      )}
      <Pagination {...paginateProps} onPageChange={onPageChange} />
    </Table>
  );
}
