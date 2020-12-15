import React, { useState } from 'react';
import { ClientHeader } from '@/components/client/ClientHeader';
import { Order, Schema$Book } from '@/typings';
import { ClientHomeSection, Book } from './ClientHomeSection';
import { useRxAsync } from 'use-rx-hooks';
import { getBooks } from '@/service';
import classes from './ClientHome.module.scss';

export interface ClientHomeProps {
  data: {
    mostvisited: Schema$Book[];
    adminSuggested: Schema$Book[];
    clientSuggested: Schema$Book[];
    finished: Schema$Book[];
  };
}

export function ClientHome({ data }: ClientHomeProps) {
  const [request] = useState(() => () => {
    return getBooks({
      sort: { updatedAt: Order.DESC },
      pageSize: data.mostvisited.length
    }).then(response => response.data);
  });
  const [books, setBooks] = useState<Book[]>(() =>
    Array.from({ length: data.mostvisited.length }).map(() => ({
      id: String(Math.random())
    }))
  );

  useRxAsync(request, { onSuccess: setBooks });

  return (
    <>
      <ClientHeader />
      <div className={classes.content}>
        <ClientHomeSection title="最近更新" books={books} />
        <ClientHomeSection title="最多瀏覽" books={data.mostvisited} />
        <ClientHomeSection title="讀者推薦" books={data.clientSuggested} />
        <ClientHomeSection title="編輯推薦" books={data.adminSuggested} />
        <ClientHomeSection title="已完結" books={data.finished} />
      </div>
    </>
  );
}
