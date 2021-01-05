import React, { useCallback } from 'react';
import { useRouter } from 'next/router';
import { AxiosError } from 'axios';
import { useRxAsync } from 'use-rx-hooks';
import { Button, NonIdealState } from '@blueprintjs/core';
import { Schema$Book } from '@/typings';
import { getBookByName } from '@/service';
import { useAuthState } from '@/hooks/useAuth';
import { Toaster } from '@/utils/toaster';
import classes from './ClientBookError.module.scss';

interface ClientBookErrorProps {
  bookName: string;
  error?: AxiosError;
  loading?: boolean;
  retry?: () => void;
}

interface GetBookByNameState extends Omit<ClientBookErrorProps, 'bookName'> {
  notFound: boolean;
  data?: Schema$Book;
}

const onFailure = Toaster.apiError.bind(Toaster, `Get book failure`);

export function useGetBookByName(
  bookName: string,
  flag?: boolean
): GetBookByNameState {
  const { loginStatus } = useAuthState();
  const waitingAuth = loginStatus === 'unknown' || loginStatus === 'loading';
  const request = useCallback(() => getBookByName({ bookName }), [bookName]);
  const [{ data, loading, error }, { fetch }] = useRxAsync(request, {
    defer: flag || waitingAuth,
    onFailure
  });
  return {
    data,
    error,
    loading,
    retry: fetch,
    notFound: !flag && !data && !loading && !waitingAuth
  };
}

export function ClientBookError({
  bookName,
  error,
  loading,
  retry
}: ClientBookErrorProps) {
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
