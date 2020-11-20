import React from 'react';
import { Card, H4 } from '@blueprintjs/core';
import { Schema$Book } from '@/typings';
import { useAuthState } from '@/hooks/useAuth';
import { BookDetailsHeader, OnUpdate } from './BookDetailsHeader';
import classes from './BookDetails.module.scss';

interface Props extends OnUpdate {
  book: Partial<Schema$Book> & Pick<Schema$Book, 'id'>;
}

export function BookDetails({ book, onUpdate }: Props) {
  const { user } = useAuthState();

  return (
    <div>
      <BookDetailsHeader book={book} role={user?.role} onUpdate={onUpdate} />

      <Card className={classes.chapters}>
        <H4>Chapters</H4>
      </Card>
    </div>
  );
}
