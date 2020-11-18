import React from 'react';
import { Input, TextArea, TagInput } from '@/components/Input';
import { CategorySelect } from '@/components/Select';
import { Param$CreateBook } from '@/typings';
import { createForm, validators } from '@/utils/form';
import { MAXIMUM_TAGS } from '@/constants';
import { BookCoverUpload } from './BookCoverUpload';
import { RxFileToImageState } from 'use-rx-hooks';

type CreateBook = Param$CreateBook & {
  cover?: RxFileToImageState;
};

export const { Form, FormItem, useForm } = createForm<CreateBook>();

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
    validators={[validators.required('Please enter the book description')]}
  >
    <TextArea rows={4} style={{ resize: 'vertical' }} />
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
        `Cannot more then ${MAXIMUM_TAGS} tags`
      )
    ]}
  >
    <TagInput />
  </FormItem>
);

export const BookCover = () => (
  <FormItem name="cover" label="Cover" noStyle>
    <BookCoverUpload />
  </FormItem>
);
