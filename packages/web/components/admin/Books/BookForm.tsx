import React from 'react';
import { Input, TagInput } from '@/components/Input';
import { CategorySelect } from '@/components/Select';
import { ContentEditor } from '@/components/admin/ContentEditor';
import { Param$CreateBook, Param$UpdateBook } from '@/typings';
import { createForm, validators, FormItemProps } from '@/utils/form';
import { Max_Tags, Max_Book_Description } from '@/constants';
import { BookCoverUpload } from './BookCoverUpload';
import classes from './Books.module.scss';

type BookFormSchema = Param$CreateBook | Param$UpdateBook;
export type BookFormItemProps = FormItemProps<BookFormSchema> & {
  deps?: undefined;
};

export const { Form, FormItem, useForm } = createForm<BookFormSchema>();

export const BookName = () => (
  <FormItem
    name="name"
    label="名稱"
    validators={[validators.required('Please enter the book name')]}
  >
    <Input />
  </FormItem>
);

export const BookDescription = () => (
  <FormItem
    name="description"
    label="簡介"
    validators={[
      validators.required('Please enter the book description'),
      validators.maxLength(
        Max_Book_Description,
        `cannot longer than ${Max_Book_Description}`
      )
    ]}
  >
    <ContentEditor className={classes['description']} />
  </FormItem>
);

export const BookCategory = () => (
  <FormItem
    name="category"
    label="類別"
    validators={[validators.required('Please select a book category')]}
  >
    <CategorySelect fill />
  </FormItem>
);

export const BookTags = () => (
  <FormItem
    name="tags"
    label="標籤"
    valuePropName="values"
    validators={[
      validators.maxLength(Max_Tags, `Cannot more than ${Max_Tags} tags`)
    ]}
  >
    <TagInput />
  </FormItem>
);

export const BookCover = () => (
  <FormItem name="cover" label="封面 ( 3 : 4 )">
    <BookCoverUpload />
  </FormItem>
);
