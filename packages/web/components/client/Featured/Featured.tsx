import React, { useRef, useEffect, useState } from 'react';
import router, { useRouter } from 'next/router';
import { useRxAsync } from 'use-rx-hooks';
import { exhaustMap } from 'rxjs/operators';
import { ButtonPopover } from '@/components/ButtonPopover';
import { withDesktopHeaderBtn } from '@/components/BlankButton';
import { ClientHeader } from '@/components/client/ClientLayout';
import { Order, Schema$Book } from '@/typings';
import { getBooks } from '@/service';
import { FeaturedSection, Book } from './FeaturedSection';
import classes from './Featured.module.scss';

export interface FeaturedProps {
  data: {
    random: Schema$Book[];
    mostvisited: Schema$Book[];
    adminSuggested: Schema$Book[];
    clientSuggested: Schema$Book[];
    finished: Schema$Book[];
  };
}

const SearchButton = withDesktopHeaderBtn(ButtonPopover);

function useRecentUpdate(pageSize: number) {
  const [books, setBooks] = useState<Book[]>(() =>
    Array.from({ length: pageSize }, (_, idx) => ({
      id: String(idx)
    }))
  );

  const [request] = useState(() => async () => {
    const response = await getBooks({
      sort: { updatedAt: Order.DESC },
      pageSize
    });
    return response.data;
  });

  const [, { fetch }] = useRxAsync(request, {
    defer: true,
    onSuccess: setBooks,
    mapOperator: exhaustMap
  });

  return { books, fetch };
}

export function Featured({ data }: FeaturedProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const { asPath } = useRouter();

  const pageSize = data.mostvisited.length || 6;
  const { books, fetch } = useRecentUpdate(pageSize);
  const loaded = !!books[0]?.name;

  // only fetch api if visbile
  useEffect(() => {
    const el = contentRef.current;
    if (el && !loaded) {
      const handler = () => {
        const visible = !!el.offsetWidth;
        visible && fetch();
      };
      handler();
      window.addEventListener('resize', handler);
      return () => window.removeEventListener('resize', handler);
    }
  }, [loaded, asPath, fetch]);

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
      <div className={classes['content']} ref={contentRef}>
        <FeaturedSection title="最近更新" books={books} />
        <FeaturedSection title="隨機推薦" books={data.random} />
        <FeaturedSection title="最多瀏覽" books={data.mostvisited} />
        <FeaturedSection title="讀者推薦" books={data.clientSuggested} />
        <FeaturedSection title="編輯推薦" books={data.adminSuggested} />
        <FeaturedSection title="已完結" books={data.finished} />
      </div>
    </>
  );
}
