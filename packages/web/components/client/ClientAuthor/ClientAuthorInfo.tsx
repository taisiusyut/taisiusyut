import React from 'react';
import { Card } from '@blueprintjs/core';
import { Skelecton } from '@/components/Skelecton';
import { Schema$Author } from '@/typings';
import classes from './ClientAuthor.module.scss';
import dayjs from 'dayjs';

interface ClientAuthorInfoProps {
  author: Schema$Author | null;
}

export function ClientAuthorInfo({ author }: ClientAuthorInfoProps) {
  const { nickname, description, createdAt } = author || {};
  return (
    <Card className={classes['info']}>
      <span className={classes['name']}>
        <Skelecton length={4}>{nickname}</Skelecton>
      </span>
      <span className={classes['date']}>
        <Skelecton length={6}>
          {createdAt && `${dayjs(createdAt).format('YYYY-MM-DD')} 加入`}
        </Skelecton>
      </span>
      <div className={classes['description']}>
        <Skelecton length={60} disabled={typeof description === 'string'}>
          {description}
        </Skelecton>
      </div>
    </Card>
  );
}
