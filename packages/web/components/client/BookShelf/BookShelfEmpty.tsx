import React from 'react';
import { useRouter } from 'next/router';
import { Button, NonIdealState } from '@blueprintjs/core';
import classes from './BookShelf.module.scss';

const searchURL = '/';

export function BookShelfEmpty() {
  const router = useRouter();

  return (
    <div className={classes['book-shelf-empty']}>
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
    </div>
  );
}
