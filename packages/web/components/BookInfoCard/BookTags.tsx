import React, { useMemo } from 'react';
import { getBookStatusTagProps, Tags, TagsProps } from '@/components/Tags';
import { Schema$Book } from '@/typings';
import classes from './BookInfoCard.module.scss';

interface Props extends TagsProps {
  book: Partial<Schema$Book>;
}

export function BookTags({ book, onTagClick, ...props }: Props) {
  const tags = useMemo(() => {
    let tags: TagsProps['tags'] = book.tags || [];
    if (book.status) {
      tags = [
        { ...getBookStatusTagProps(book.status), interactive: false },
        ...tags
      ];
    }
    return tags;
  }, [book.tags, book.status]);

  return (
    <Tags
      {...props}
      tags={tags}
      onTagClick={onTagClick}
      className={classes['tags']}
    />
  );
}
