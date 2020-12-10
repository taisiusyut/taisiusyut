import React from 'react';
import { useRouter } from 'next/router';
import { Button, NonIdealState } from '@blueprintjs/core';
import { useAuthState } from '@/hooks/useAuth';
import { withAuthRequired } from '@/components/client/withAuthRequired';
import classes from './BookShelf.module.scss';

const searchURL = '/';

const LoginButton = withAuthRequired(Button);

export function BookShelfEmpty() {
  const router = useRouter();
  const auth = useAuthState();

  if (auth.loginStatus === 'loading' || auth.loginStatus === 'unknown') {
    return null;
  }

  let content = (
    <NonIdealState
      description="尚未加入書籍📚"
      action={
        router.pathname === searchURL ? undefined : (
          <Button
            text="搜索書籍"
            intent="primary"
            onClick={() => router.push(searchURL)}
          />
        )
      }
    />
  );

  if (auth.loginStatus !== 'loggedIn') {
    content = (
      <NonIdealState
        description="請先登陸"
        action={
          <LoginButton
            text="登陸"
            intent="primary"
            onClick={() => router.push(searchURL)}
          />
        }
      />
    );
  }

  return <div className={classes['book-shelf-empty']}>{content}</div>;
}
