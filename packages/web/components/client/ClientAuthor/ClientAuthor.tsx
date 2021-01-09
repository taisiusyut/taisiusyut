import React, { useCallback } from 'react';
import { useRxAsync } from 'use-rx-hooks';
import { ClientHeader } from '@/components/client/ClientLayout';
import { GoBackButton } from '@/components/GoBackButton';
import { getAuthorByName } from '@/service';
import { Schema$Author, Schema$Book } from '@/typings';
import { ClientAuthorInfo } from './ClientAuthorInfo';
import { ClientAuthorBook } from './ClientAuthorBook';
import classes from './ClientAuthor.module.scss';

export type ClientAuthorParams = {
  authorName: string;
};

export interface ClientAuthorProps extends ClientAuthorParams {
  author: Schema$Author | null;
  books: Schema$Book[] | null;
}

const targetPath = ['/book/:bookName', '/search', '/featured', '/'];

export function ClientAuthor({
  authorName,
  author: initialAuthor,
  books: initialBooks
}: ClientAuthorProps) {
  const request = useCallback(() => getAuthorByName(authorName), [authorName]);
  const [{ data }] = useRxAsync(request, { defer: !!initialAuthor });
  const author = data || initialAuthor;

  return (
    <>
      <ClientHeader
        title="作者"
        left={<GoBackButton targetPath={targetPath} />}
      />
      <div className={classes['container']}>
        <ClientAuthorInfo author={author} />
        <ClientAuthorBook authorName={authorName} books={initialBooks} />
      </div>
    </>
  );
}
