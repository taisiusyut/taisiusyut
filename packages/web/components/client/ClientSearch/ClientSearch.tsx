import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ClientHeader } from '@/components/client/ClientLayout';
import { ButtonPopover } from '@/components/ButtonPopover';
import { useSearchResult } from './useSearchResult';
import {
  useForm,
  transoform,
  ClientSearchInput,
  Store
} from './ClientSearchInput';
import { ClientSearchItem } from './ClientSearchItem';
import { ClientSearchNotFound } from './ClientSearchNotFound';
import classes from './ClientSearch.module.scss';

interface Props {
  onLeave: () => void;
}

const createId = (idx: number) => `search-result-${idx}`;

export function ClientSearch({ onLeave }: Props) {
  const router = useRouter();
  const { asPath, query } = router;
  const [form] = useForm();
  const [search, setSearch] = useState(() =>
    transoform(asPath.startsWith('/search') ? query : {})
  );
  const { state, scrollerRef } = useSearchResult(search);

  const handleSearch = (search: Store) => {
    setSearch(search);
    router.push(
      {
        pathname: '/search',
        query: search.value ? { [search.type]: search.value } : undefined
      },
      undefined,
      { shallow: true }
    );
  };

  const searchButton = (
    <ButtonPopover minimal icon="cross" content="取消搜索" onClick={onLeave} />
  );

  const items = state.list.map((book, idx) => (
    <ClientSearchItem key={book.id} book={book} className={createId(idx)} />
  ));

  const notFound = state.list.length === 0 && search.value?.trim() && (
    <ClientSearchNotFound
      className={classes['not-found']}
      searchType={search.type}
    />
  );

  useEffect(() => {
    form.setFieldsValue(search);
  }, [search, form]);

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

  return (
    <div className={classes['search']}>
      <ClientHeader title="搜索書籍" left={searchButton} />

      <div className={classes['content']}>
        <ClientSearchInput form={form} onFinish={handleSearch} />

        <div className={classes['books']} ref={scrollerRef}>
          <div className={classes['border']} />
          {items}
        </div>

        {notFound}
      </div>
    </div>
  );
}
