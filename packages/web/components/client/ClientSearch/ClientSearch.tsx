import React from 'react';
import { Button, Tag } from '@blueprintjs/core';
import { ClientHeader } from '@/components/client/ClientLayout';
import { GoBackButton } from '@/components/GoBackButton';
import { Input } from '@/components/Input';
import classes from './ClientSearch.module.scss';

export function ClientSearch() {
  return (
    <div className={classes['search']}>
      <ClientHeader
        title="搜索書籍"
        left={<GoBackButton targetPath={['/', '/featured']} />}
      />
      <div className={classes['content']}>
        <div className={classes['border']} />
        <form
          className={classes['search-field']}
          onSubmit={event => event.preventDefault()}
        >
          <Input
            large
            autoFocus
            leftElement={
              <Tag minimal rightIcon="chevron-down">
                書名
              </Tag>
            }
            rightElement={<Button icon="search" minimal />}
          />
        </form>
      </div>
    </div>
  );
}
