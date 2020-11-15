import React from 'react';
import { useRouter } from 'next/router';
import { Button, NonIdealState, INonIdealStateProps } from '@blueprintjs/core';
import { clearSearchParam } from '../utils/setSearchParam';

export interface NotFoundProps {}

export const NotFound = React.memo<NotFoundProps>(() => {
  const { asPath } = useRouter();
  const hasQuery = /\?.{1,}/.test(asPath);
  const props: INonIdealStateProps = hasQuery
    ? {
        description: (
          <>
            <div>Your search do not match any results.</div>
            <div>Try searching for something else.</div>
          </>
        ),
        action: (
          <Button intent="primary" onClick={clearSearchParam}>
            Clear Search
          </Button>
        )
      }
    : {};

  return (
    <div style={{ padding: '20px 0' }}>
      <NonIdealState icon="search" title="No results found" {...props} />
    </div>
  );
});
