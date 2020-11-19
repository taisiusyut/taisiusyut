import React from 'react';
import {
  Card,
  H3,
  Tag,
  Button,
  Popover,
  Menu,
  MenuItem
} from '@blueprintjs/core';
import { Schema$Book, BookStatus } from '@/typings';
import { BookModel } from '@/components/BookModel';
import { withPublishBook } from './PublishBook';
import { withFinishBook } from './FinishBook';
import { withUpdateBook } from './UpdateBook';
import classes from './BookDetails.module.scss';

interface Props {
  book: Partial<Schema$Book> & Pick<Schema$Book, 'id'>;
}

const PublishBook = withPublishBook(MenuItem);
const FinishBook = withFinishBook(MenuItem);
const UpdateBook = withUpdateBook(MenuItem);

// TODO: add book status, createdAt, go back

export function BookDetailsHeader(props: Props) {
  const { book } = props;

  const bookModel = (
    <BookModel
      className={classes['book-model']}
      width={80}
      cover={book.cover}
    />
  );

  const title = (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
      <H3 style={{ marginBottom: 0, marginRight: 10 }}>{book.name}</H3>
      <Tag minimal>{book.status && BookStatus[book.status]}</Tag>
    </div>
  );

  // TODO: color props
  const tags = (
    <div className={classes.tags}>
      {book.tags?.map(value => (
        <Tag key={value} className={classes.tag}>
          {value}
        </Tag>
      ))}
    </div>
  );

  const description = (
    <div className={classes.description}>{book.description}</div>
  );

  const menu = (
    <Menu>
      <MenuItem text="New Chapter" />
      <UpdateBook text="Update Book" bookID={book.id} book={book} />
      {book.status === BookStatus.Private && (
        <PublishBook text="Publish Book" bookID={book.id} />
      )}
      {book.status === BookStatus.Public && (
        <FinishBook text="Finish Book" bookID={book.id} />
      )}
    </Menu>
  );

  return (
    <Card>
      <div className={classes.header}>
        {bookModel}
        <div className={classes['header-content']}>
          {title}
          {tags}
          {description}
        </div>
        <Popover position="left-top" content={menu}>
          <Button icon="more" minimal />
        </Popover>
      </div>
    </Card>
  );
}
