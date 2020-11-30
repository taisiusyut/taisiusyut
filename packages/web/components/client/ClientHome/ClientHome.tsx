import React from 'react';
import { ControlGroup, Button } from '@blueprintjs/core';
import { ClientHeader } from '@/components/client/ClientHeader';
import { SearchInput } from '@/components/Input';
import { Schema$Book } from '@/typings';
import { ClientHomeSection } from './ClientHomeSection';
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
  return (
    <>
      <ClientHeader />
      <div
        style={{ padding: 25, maxWidth: 768, margin: 'auto', width: '100%' }}
      >
        <ControlGroup>
          <SearchInput />
          <Button icon="search" intent="primary" />
        </ControlGroup>
      </div>
      <div className={classes.content}>
        <ClientHomeSection title="最近更新" books={[]} />
        <ClientHomeSection title="最多瀏覽" books={data.mostvisited} />
        <ClientHomeSection title="讀者推薦" books={data.clientSuggested} />
        <ClientHomeSection title="編輯推薦" books={data.adminSuggested} />
        <ClientHomeSection title="已完結" books={data.finished} />
      </div>
    </>
  );
}
