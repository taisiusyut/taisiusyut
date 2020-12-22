import React from 'react';
import { NonIdealState, INonIdealStateProps } from '@blueprintjs/core';

interface Props extends INonIdealStateProps {
  searchType?: string;
}

function getErrorText(type?: string) {
  switch (type) {
    case 'name':
      return `書名`;
    case 'author':
      return `作者名稱`;
    case 'tag':
      return `標籤`;
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
          {text && (
            <>
              <div>請檢查「{text}」否正確</div>
              <div>或選擇「全部」並重新搜索</div>
            </>
          )}
        </>
      }
    />
  );
}
