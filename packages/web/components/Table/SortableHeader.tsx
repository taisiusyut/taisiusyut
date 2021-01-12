import React from 'react';
import router from 'next/router';
import { Icon, IIconProps } from '@blueprintjs/core';
import { Order } from '@/typings';
import { JSONParse } from '@/utils/JSONParse';
import { setSearchParam } from '@/utils/setSearchParam';
import classes from './Table.module.scss';

type TableHeaderProps = React.DetailedHTMLProps<
  React.ThHTMLAttributes<HTMLTableHeaderCellElement>,
  HTMLTableHeaderCellElement
>;

interface Props extends TableHeaderProps {
  field: string;
}

function getIcon(order: Order): IIconProps['icon'] {
  if (order === Order.DESC) return 'arrow-down';
  if (order === Order.ASC) return 'arrow-up';
  return 'swap-vertical';
}

export function SortableHeader({ field, children, ...props }: Props) {
  const sort = JSONParse<Record<string, unknown>>(
    router.query['sort'] as string,
    {}
  );
  const order = Number(sort[field]);

  return (
    <div
      {...props}
      onClick={() =>
        setSearchParam(({ sort, ...params }) => {
          return {
            ...params,
            sort: JSON.stringify({
              [field]: order === Order.DESC ? Order.ASC : Order.DESC
            })
          };
        })
      }
    >
      <div className={classes['th']}>
        {children}
        {<Icon iconSize={12} icon={getIcon(order)} />}
      </div>
    </div>
  );
}
