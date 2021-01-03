import React from 'react';
import router from 'next/router';
import { Icon } from '@blueprintjs/core';
import { Order } from '@/typings';
import { JSONParse } from '@/utils/JSONParse';
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
  const sort = JSONParse<Record<string, unknown>>(
    router.query['sort'] as string,
    {}
  );
  const order = Number(sort[field] || defaultOrder);

  return (
    <div
      {...props}
      onClick={() =>
        setSearchParam(({ sort, ...params }) => {
          return {
            ...params,
            sort: JSON.stringify({
              ...JSONParse<Record<string, unknown>>(sort as string, {}),
              [field]: order === Order.DESC ? Order.ASC : Order.DESC
            })
          };
        })
      }
    >
      <div className={classes['th']}>
        {children}
        {
          <Icon
            iconSize={12}
            icon={order === Order.DESC ? 'arrow-down' : 'arrow-up'}
          />
        }
      </div>
    </div>
  );
}
