import React from 'react';
import { Card, H4 } from '@blueprintjs/core';
import { Schema$Book } from '@/typings';
import { BookDetailsHeader } from './BookDetailsHeader';

import classes from './BookDetails.module.scss';

interface Props {
  book: Partial<Schema$Book> & Pick<Schema$Book, 'id'>;
}

export function BookDetails(props: Props) {
  const { book } = props;
  return (
    <div>
      <BookDetailsHeader book={book} />

      <Card className={classes.chapters}>
        <H4>Chapters</H4>
      </Card>
    </div>
  );
}
