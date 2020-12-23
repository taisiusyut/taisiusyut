import React from 'react';
import { useRouter } from 'next/router';
import { Button, NonIdealState } from '@blueprintjs/core';
import { useAuthState } from '@/hooks/useAuth';
import { withAuthRequired } from '@/components/client/withAuthRequired';
import classes from './BookShelf.module.scss';

const LoginButton = withAuthRequired(Button);

export function BookShelfEmpty() {
  const router = useRouter();
  const auth = useAuthState();

  if (auth.loginStatus === 'loading') {
    return null;
  }

  let content = (
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
  );

  if (auth.loginStatus !== 'loggedIn') {
    content = (
      <NonIdealState
        description="請先登入"
        action={<LoginButton text="登入" intent="primary" />}
      />
    );
  }

  return <div className={classes['book-shelf-empty']}>{content}</div>;
}
