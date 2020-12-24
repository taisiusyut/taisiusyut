import React, { useState } from 'react';
import router from 'next/router';
import { useRxAsync } from 'use-rx-hooks';
import { ButtonPopover } from '@/components/ButtonPopover';
import { withDesktopHeaderBtn } from '@/components/BlankButton';
import { ClientHeader } from '@/components/client/ClientLayout';
import { Order, Schema$Book } from '@/typings';
import { getBooks } from '@/service';
import { FeaturedSection, Book } from './FeaturedSection';
import classes from './Featured.module.scss';

export interface FeaturedProps {
  data: {
    mostvisited: Schema$Book[];
    adminSuggested: Schema$Book[];
    clientSuggested: Schema$Book[];
    finished: Schema$Book[];
  };
}

const SearchButton = withDesktopHeaderBtn(ButtonPopover);

export function Featured({ data }: FeaturedProps) {
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
      <ClientHeader
        title="精選"
        right={
          <SearchButton
            minimal
            icon="search"
            content="搜索書籍"
            onClick={() => router.push('/search')}
          />
        }
      />
      <div className={classes['content']}>
        <FeaturedSection title="最近更新" books={books} />
        <FeaturedSection title="最多瀏覽" books={data.mostvisited} />
        <FeaturedSection title="讀者推薦" books={data.clientSuggested} />
        <FeaturedSection title="編輯推薦" books={data.adminSuggested} />
        <FeaturedSection title="已完結" books={data.finished} />
      </div>
    </>
  );
}
