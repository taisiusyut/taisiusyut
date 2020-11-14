import React from 'react';
import router from 'next/router';
import { Order } from '@/typings';
import { Icon } from '@blueprintjs/core';
import { setSearchParam } from '@/utils/setSearchParam';
import classes from './Table.module.scss';

interface Props
  extends React.DetailedHTMLProps<
    React.ThHTMLAttributes<HTMLTableHeaderCellElement>,
    HTMLTableHeaderCellElement
  > {
  field: string;
  defaultOrder: Order;
}

export function SortableHeader({
  field,
  children,
  defaultOrder,
  ...props
}: Props) {
  const order = Number(router.query[`sort[${field}]`] || defaultOrder);

  return (
    <div
      {...props}
      onClick={() =>
        setSearchParam(({ sort, ...params }) => ({
          ...params,
          sort: {
            ...(sort as Record<string, unknown>),
            [field]: order === Order.DESC ? Order.ASC : Order.DESC
          }
        }))
      }
    >
      <div className={classes.th}>
        {children}
        {<Icon icon={order === Order.DESC ? 'arrow-down' : 'arrow-up'} />}
      </div>
    </div>
  );
}
