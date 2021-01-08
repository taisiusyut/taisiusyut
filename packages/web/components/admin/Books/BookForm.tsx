import React from 'react';
import { Input, TagInput } from '@/components/Input';
import { CategorySelect } from '@/components/Select';
import { ContentEditor } from '@/components/admin/ContentEditor';
import { Param$CreateBook, Param$UpdateBook } from '@/typings';
import { createForm, validators } from '@/utils/form';
import { MAXIMUM_TAGS, MAXIMUM_BOOK_DESCRIPTION } from '@/constants';
import { BookCoverUpload } from './BookCoverUpload';
import classes from './Books.module.scss';

type BookFormSchema = Param$CreateBook | Param$UpdateBook;

export const { Form, FormItem, useForm } = createForm<BookFormSchema>();

export const BookName = () => (
  <FormItem
    name="name"
    label="Name"
    validators={[validators.required('Please enter the book name')]}
  >
    <Input />
  </FormItem>
);

export const BookDescription = () => (
  <FormItem
    name="description"
    label="Description"
    validators={[
      validators.required('Please enter the book description'),
      validators.maxLength(
        MAXIMUM_BOOK_DESCRIPTION,
        `cannot longer than ${MAXIMUM_BOOK_DESCRIPTION}`
      )
    ]}
  >
    <ContentEditor className={classes['description']} />
  </FormItem>
);

export const BookCategory = () => (
  <FormItem
    name="category"
    label="Category"
    validators={[validators.required('Please select a book category')]}
  >
    <CategorySelect fill />
  </FormItem>
);

export const BookTags = () => (
  <FormItem
    name="tags"
    label="Tags"
    valuePropName="values"
    validators={[
      validators.maxLength(
        MAXIMUM_TAGS,
        `Cannot more than ${MAXIMUM_TAGS} tags`
      )
    ]}
  >
    <TagInput />
  </FormItem>
);

export const BookCover = () => (
  <FormItem name="cover" label="Cover ( 3 : 4 )">
    <BookCoverUpload />
  </FormItem>
);
