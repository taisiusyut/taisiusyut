import React, { ReactNode } from 'react';
import { H4 } from '@blueprintjs/core';
import { GoBackButton } from '@/components/GoBackButton';
import { resolve } from 'styled-jsx/css';

interface Props {
  title?: ReactNode;
  children?: ReactNode;
  targetPath?: string;
}

const h4 = resolve`
  h4 {
    margin-bottom: 0;
  }
`;

const button = resolve`
  button {
    margin-right: 5px;
    margin-left: -5px;
  }
`;

export function PageHeader({ title, targetPath, children }: Props) {
  return (
    <div className="header">
      <div className="title">
        {targetPath && (
          <GoBackButton targetPath={targetPath} className={button.className} />
        )}
        <H4 className={h4.className}>{title}</H4>
      </div>
      <div>{children}</div>
      {h4.styles}
      {button.styles}
      <style jsx>
        {`
          .header {
            @include flex(center, space-between);
          }

          .title {
            @include flex(center);
          }
        `}
      </style>
    </div>
  );
}
