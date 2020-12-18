import React, { useState } from 'react';
import { useRxAsync } from 'use-rx-hooks';
import { ClientHeader } from '@/components/client/ClientHeader';
import { Order, Schema$Book } from '@/typings';
import { getBooks } from '@/service';
import { ExploreSection, Book } from './ExploreSection';
import classes from './Explore.module.scss';

export interface ExploreProps {
  data: {
    mostvisited: Schema$Book[];
    adminSuggested: Schema$Book[];
    clientSuggested: Schema$Book[];
    finished: Schema$Book[];
  };
}

export function Explore({ data }: ExploreProps) {
  const [request] = useState(() => async () => {
    const response = await getBooks({
      sort: { updatedAt: Order.DESC },
      pageSize: data.mostvisited.length
    });
    return response.data;
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
        <ExploreSection title="最近更新" books={books} />
        <ExploreSection title="最多瀏覽" books={data.mostvisited} />
        <ExploreSection title="讀者推薦" books={data.clientSuggested} />
        <ExploreSection title="編輯推薦" books={data.adminSuggested} />
        <ExploreSection title="已完結" books={data.finished} />
      </div>
    </>
  );
}
