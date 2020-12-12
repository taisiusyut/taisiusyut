import React from 'react';
import { Card, H3, Button, Popover, Menu, MenuItem } from '@blueprintjs/core';
import { Schema$Book, BookStatus, UserRole } from '@/typings';
import { PageHeader } from '@/components/admin/PageHeader';
import { BookStatusTag } from '@/components/Tags/BookStatusTag';
import { BookModel } from '@/components/BookModel';
import { Tags } from '@/components/Tags';
import { withPublishBook } from './PublishBook';
import { withFinishBook } from './FinishBook';
import { withUpdateBook } from './UpdateBook';
import classes from './BookDetails.module.scss';

export interface OnUpdate {
  onUpdate: (payload: Partial<Schema$Book>) => void;
}

interface Props extends OnUpdate {
  book: Partial<Schema$Book> & Pick<Schema$Book, 'id'>;
  role?: UserRole;
}

const PublishBook = withPublishBook(MenuItem);
const FinishBook = withFinishBook(MenuItem);
const UpdateBook = withUpdateBook(MenuItem);

// TODO: createdAt, author

export function BookDetailsHeader({ book, role, onUpdate }: Props) {
  let actions, menu;

  if (role === UserRole.Author) {
    menu = (
      <Menu>
        <UpdateBook
          text="Update Book"
          bookID={book.id}
          book={book}
          onUpdate={onUpdate}
        />
        {book.status === BookStatus.Private && (
          <PublishBook
            text="Publish Book"
            bookID={book.id}
            onSuccess={onUpdate}
          />
        )}
        {book.status === BookStatus.Public && (
          <FinishBook
            text="Finish Book"
            bookID={book.id}
            onSuccess={onUpdate}
          />
        )}
      </Menu>
    );

    actions = (
      <Popover position="left-top" content={menu}>
        <Button icon="more" minimal />
      </Popover>
    );
  }

  return (
    <>
      <Card>
        <PageHeader targetPath={`/admin/book`} title="Book Details">
          {actions}
        </PageHeader>
      </Card>
      <Card style={{ marginTop: 15 }}>
        <div className={classes.header}>
          <BookModel
            flatten
            width={80}
            className={classes['book-model']}
            cover={book.cover}
          />

          <div className={classes['header-content']}>
            <div className={classes['header-title']}>
              <H3 style={{ marginBottom: 0, marginRight: 10 }}>{book.name}</H3>
              <BookStatusTag status={book.status} />
            </div>
            <Tags tags={book.tags || []} />
            <div className={classes.description}>{book.description}</div>
          </div>
        </div>
      </Card>
    </>
  );
}
