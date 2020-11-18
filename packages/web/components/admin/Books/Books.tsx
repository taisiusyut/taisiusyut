import React from 'react';
import { Card, H4 } from '@blueprintjs/core';
import { useAuthState } from '@/hooks/useAuth';
import { CreateBook } from './CreateBook';
import { UserRole } from '@/typings';
import classes from './Books.module.scss';

export function Books() {
  const { user } = useAuthState();

  return (
    <Card>
      <div className={classes.header}>
        <H4>Books</H4>
        <div className={classes['button-group']}>
          {user?.role === UserRole.Author && (
            <CreateBook onCreate={() => void 0} />
          )}
        </div>
      </div>
    </Card>
  );
}
