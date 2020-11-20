import React from 'react';
import { Card, H3, Button, Popover, Menu, MenuItem } from '@blueprintjs/core';
import { Schema$Book, BookStatus, UserRole } from '@/typings';
import { BookModel } from '@/components/BookModel';
import { Tags } from '@/components/Tags';
import { BookStatusTag } from '@/components/admin/Books/BookStatusTag';
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

// TODO:  createdAt, go back

export function BookDetailsHeader({ book, role, onUpdate }: Props) {
  return (
    <Card>
      <div className={classes.header}>
        <BookModel
          className={classes['book-model']}
          width={80}
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

        {role === UserRole.Author && (
          <Popover
            position="left-top"
            content={
              <Menu>
                <MenuItem text="New Chapter" />
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
            }
          >
            <Button icon="more" minimal />
          </Popover>
        )}
      </div>
    </Card>
  );
}
