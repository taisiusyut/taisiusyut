import React, { ReactNode, useState } from 'react';
import { Button } from '@blueprintjs/core';

export const Blank = () => (
  <Button minimal icon="blank" style={{ visibility: 'hidden' }} />
);

export interface HeaderProps {
  title?: ReactNode;
  left?: ReactNode | ReactNode[];
  right?: ReactNode | ReactNode[];
  children?: ReactNode;
}

function getLength(payload: unknown) {
  return Array.isArray(payload) ? payload.length : payload ? 1 : 0;
}

function createSpacer(self: unknown, target: unknown) {
  return Array.from(
    { length: Math.max(0, getLength(target) - getLength(self)) },
    (_, idx) => (
      <Button key={idx} minimal icon="blank" style={{ visibility: 'hidden' }} />
    )
  );
}

export function ClientHeader({
  title,
  children,
  left,
  right = children
}: HeaderProps) {
  const [fillLeft] = useState(createSpacer(left, right));
  const [fillRight] = useState(createSpacer(right, left));

  return (
    <div className="header">
      <div>
        {left}
        {fillLeft}
      </div>
      <div className="header-title">{title}</div>
      <div>
        {right}
        {fillRight}
      </div>
      <style jsx>
        {`
          $header-height: 50px;

          .header {
            @include dimen(100%, $header-height);
            @include flex(center, center);
            @include padding-x(15px);
            border-bottom: 1px solid var(--divider-color);
            flex: 0 0 auto;
            background-color: var(--primary-color);
          }

          .header-title {
            @include text-overflow-ellipsis();
            @include padding-x(10px);
            flex: 1 1 auto;
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 0;
            text-align: center;
          }
        `}
      </style>
    </div>
  );
}
