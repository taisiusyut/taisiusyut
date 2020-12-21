import React from 'react';
import { NonIdealState, INonIdealStateProps } from '@blueprintjs/core';

interface Props extends INonIdealStateProps {
  searchType?: string;
}

function getErrorText(type?: string) {
  switch (type) {
    case 'name':
      return `請檢查書名是否正確及完整`;
    case 'author':
      return `請檢查作者名稱是否正確及完整`;
    default:
      return '';
  }
}

export function ClientSearchNotFound(props: Props) {
  const text = getErrorText(props.searchType);
  return (
    <NonIdealState
      {...props}
      icon="search"
      description={
        <>
          <div>找不到相關結果</div>
          {text && <div>{text}</div>}
        </>
      }
    />
  );
}
