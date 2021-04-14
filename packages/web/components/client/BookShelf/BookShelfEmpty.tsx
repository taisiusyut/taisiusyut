import React from 'react';
import { useRouter } from 'next/router';
import { Button, NonIdealState } from '@blueprintjs/core';
import { useAuthState } from '@/hooks/useAuth';
import classes from './BookShelf.module.scss';

export function BookShelfEmpty() {
  const router = useRouter();
  const auth = useAuthState();

  if (auth.loginStatus === 'loading') {
    return null;
  }

  return (
    <div className={classes['book-shelf-empty']}>
      <NonIdealState
        description="尚未加入書籍📚"
        action={
          <Button
            text="搜索書籍"
            intent="primary"
            onClick={() => router.push(`/search`)}
          />
        }
      />
    </div>
  );
}
