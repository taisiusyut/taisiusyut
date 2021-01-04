import React from 'react';
import { useRouter } from 'next/router';
import { AxiosError } from 'axios';
import { Button, NonIdealState } from '@blueprintjs/core';
import classes from './ClientBookDetails.module.scss';

interface Props {
  bookName: string;
  error?: AxiosError;
  loading?: boolean;
  retry?: () => void;
}

export function ClientBookError({ bookName, error, loading, retry }: Props) {
  const router = useRouter();
  let action: React.ReactElement | undefined;

  if (error?.response?.status === 404) {
    action = router.asPath.startsWith('/search') ? undefined : (
      <Button
        text="搜索書籍"
        intent="primary"
        onClick={() =>
          router.push({
            pathname: `/search`,
            query: { search: bookName }
          })
        }
      />
    );
  } else {
    action = (
      <Button text="重試" intent="primary" loading={loading} onClick={retry} />
    );
  }

  return (
    <div className={classes['error']}>
      <NonIdealState
        description={`未有「${bookName}」相關書籍`}
        action={action}
      />
    </div>
  );
}
