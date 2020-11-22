import React, { ReactNode } from 'react';
import { Button, H4 } from '@blueprintjs/core';
import { useHistoryBack } from '@/hooks/useHistoryBack';
import { resolve } from 'styled-jsx/css';

interface Props {
  title?: ReactNode;
  children?: ReactNode;
  goBackURL?: string;
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

export function PageHeader({ title, goBackURL: url, children }: Props) {
  const goBack = useHistoryBack();
  return (
    <div className="header">
      <div className="title">
        {url && (
          <Button
            minimal
            icon="arrow-left"
            className={button.className}
            onClick={() => goBack(url)}
          />
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
