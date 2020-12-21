import React, { useEffect, useMemo, useState } from 'react';
import router from 'next/router';
import { useRxAsync } from 'use-rx-hooks';
import { ClientHeader } from '@/components/client/ClientLayout';
import { ButtonPopover } from '@/components/ButtonPopover';
import { createUseCRUDReducer } from '@/hooks/crud-reducer';
import { Param$GetBooks } from '@/typings';
import { getBooks } from '@/service';
import { Toaster } from '@/utils/toaster';
import {
  ClientSearchInput,
  useForm,
  transoformInitialValues
} from './ClientSearchInput';
import { ClientSearchItem, Book } from './ClientSearchItem';
import { ClientSearchNotFound } from './ClientSearchNotFound';
import qs from 'qs';
import classes from './ClientSearch.module.scss';

interface Props {
  onLeave: () => void;
}

const useBookReducer = createUseCRUDReducer<Book, 'id'>('id');

const placeholder = Array.from<void, Book>({ length: 10 }, (_, idx) => ({
  id: String(idx)
}));

const onFailure = Toaster.apiError.bind(Toaster, `Get books failure`);

export function ClientSearch({ onLeave }: Props) {
  const [query, setQuery] = useState<Record<string, any>>({});
  const [state, actions] = useBookReducer();
  const [, { fetch }] = useRxAsync(getBooks, {
    defer: true,
    onSuccess: actions.paginate,
    onFailure
  });
  const [form] = useForm();
  const { search, request } = useMemo(() => {
    const search = transoformInitialValues(query);
    const request = (params?: Param$GetBooks) => fetch({ ...params });
    return {
      search,
      request
    };
  }, [fetch, query]);

  useEffect(() => {
    if (router.asPath.startsWith('/search')) {
      setQuery(qs.parse(router.asPath.split('?')[1]));
    }
  }, []);

  useEffect(() => {
    form.setFieldsValue(search);

    if (search.type && search.value?.trim()) {
      actions.paginate(placeholder);
      request({ pageNo: 1 });
    } else {
      actions.list([]);
    }
  }, [search, request, form, actions]);

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
          initialValues={query}
          onFinish={({ ...payload }) => {
            setQuery(payload);
            for (const key in payload) {
              if (!payload[key]) {
                delete payload[key];
              }
            }
            router.push({
              pathname: '/search',
              query: payload
            });
          }}
        />
        {state.list.length ? (
          <div className={classes['books']}>
            <div className={classes['border']} />
            {state.list.map(book => (
              <ClientSearchItem key={book.id} book={book} />
            ))}
          </div>
        ) : Object.keys(query).length ? (
          <ClientSearchNotFound
            className={classes['not-found']}
            searchType={search.type}
          />
        ) : null}
      </div>
    </div>
  );
}
