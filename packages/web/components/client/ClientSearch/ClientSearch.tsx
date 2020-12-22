import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { AxiosError } from 'axios';
import { EMPTY, fromEvent, merge } from 'rxjs';
import {
  catchError,
  distinctUntilChanged,
  mergeMap,
  startWith,
  map,
  tap
} from 'rxjs/operators';
import { ClientHeader } from '@/components/client/ClientLayout';
import { ButtonPopover } from '@/components/ButtonPopover';
import { createUseCRUDReducer } from '@/hooks/crud-reducer';
import { getBooks } from '@/service';
import { Toaster } from '@/utils/toaster';
import { useForm, transoform, ClientSearchInput } from './ClientSearchInput';
import { ClientSearchItem, Book } from './ClientSearchItem';
import { ClientSearchNotFound } from './ClientSearchNotFound';
import classes from './ClientSearch.module.scss';

interface Props {
  onLeave: () => void;
}

const useBookReducer = createUseCRUDReducer<Book, 'id'>('id', {
  initializer: state => ({ ...state, pageSize })
});

const pageSize = 10;

const placeholder = Array.from<void, Book>({ length: pageSize }, (_, idx) => ({
  id: String(idx)
}));

const createId = (idx: number) => `search-result-${idx}`;

export function ClientSearch({ onLeave }: Props) {
  const { asPath, query, push } = useRouter();
  const [search, setSearch] = useState(() =>
    transoform(asPath.startsWith('/search') ? query : {})
  );
  const [state, actions] = useBookReducer();
  const [form] = useForm();
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (asPath.startsWith('/search')) {
      setSearch(search => {
        const newSearch = transoform(query);
        const hasChange =
          search.type !== newSearch.type || search.value !== newSearch.value;
        return hasChange ? newSearch : search;
      });
    }
  }, [asPath, query]);

  useEffect(() => {
    form.setFieldsValue(search);
  }, [search, form]);

  useEffect(() => {
    const scroller = scrollerRef.current;

    if (!scroller) {
      throw new Error(`scroller is not defined`);
    }

    const scroller$ = fromEvent(scroller, 'scroll').pipe(
      map(
        () =>
          [
            scroller.scrollTop,
            scroller.offsetHeight + scroller.offsetTop
          ] as const
      )
    );

    const windowScroll$ = fromEvent(window, 'scroll').pipe(
      map(() => [window.scrollY, window.innerHeight] as const)
    );

    let pageNo = 1;

    if (search.type && search.value?.trim()) {
      const subscription = merge(scroller$, windowScroll$)
        .pipe(
          startWith([0, 0]),
          map(([scrollTop, offsetHeight]) => {
            const nextIndex = pageNo * pageSize;
            const target = document.querySelector<HTMLElement>(
              `.${createId(nextIndex)}`
            );
            if (target && scrollTop + offsetHeight >= target.offsetTop) {
              pageNo += 1;
            }
            return pageNo;
          }),
          distinctUntilChanged(),
          tap(pageNo => {
            if (pageNo === 1) {
              // reset scroll position
              window.scrollTo(0, 0);
              scroller.scrollTop = 0;
              actions.list(placeholder);
            }
          }),
          mergeMap(pageNo => getBooks({ [search.type]: search.value, pageNo })),
          catchError((error: AxiosError) => {
            if (error.config.params?.pageNo === 1) {
              actions.list([]);
            }
            Toaster.apiError(`Get books failure`, error);
            return EMPTY;
          })
        )
        .subscribe(payload => {
          actions.paginate(payload);
        });
      return () => subscription.unsubscribe();
    } else {
      // for clear search result
      actions.list([]);
    }
  }, [actions, search]);

  return (
    <div className={classes['search']}>
      <ClientHeader
        title="搜索書籍"
        left={
          <ButtonPopover
            minimal
            icon="cross"
            content="取消搜索"
            onClick={onLeave}
          />
        }
      />
      <div className={classes['content']}>
        <ClientSearchInput
          form={form}
          onFinish={search => {
            setSearch(search);
            push(
              {
                pathname: '/search',
                query: search.value
                  ? { [search.type]: search.value }
                  : undefined
              },
              undefined,
              { shallow: true }
            );
          }}
        />
        <div className={classes['books']} ref={scrollerRef}>
          {
            <>
              <div className={classes['border']} />
              {state.list.map((book, idx) => (
                <ClientSearchItem
                  key={book.id}
                  book={book}
                  className={createId(idx)}
                />
              ))}
            </>
          }
        </div>
        {state.list.length === 0 && search.value?.trim() && (
          <ClientSearchNotFound
            className={classes['not-found']}
            searchType={search.type}
          />
        )}
      </div>
    </div>
  );
}
