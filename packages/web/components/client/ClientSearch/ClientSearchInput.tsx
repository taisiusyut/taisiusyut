import React from 'react';
import { Button, HTMLSelect } from '@blueprintjs/core';
import { Input } from '@/components/Input';
import { createForm, FormProps } from '@/utils/form';
import classes from './ClientSearch.module.scss';

interface Store {
  type: string;
  value: string;
}

type Values = Record<string, any>;

interface Props extends FormProps<Store, Values> {}

const options = [
  { value: 'search', label: '全部' },
  { value: 'name', label: '書名' },
  { value: 'author', label: '作者' },
  { value: 'tag', label: '標籤' }
];

const { Form, FormItem, useForm } = createForm<Store, Values>({
  noStyle: true
});

export { useForm };

export const transoformInitialValues: NonNullable<
  Props['transoformInitialValues']
> = query => {
  const types = ['name', 'author', 'tag'];
  for (const type of types) {
    if (typeof query[type] === 'string') {
      return { type, value: query[type] };
    }
  }
  return { type: 'search', value: query.search };
};

const beforeSubmit: Props['beforeSubmit'] = ({ value, type }) => ({
  [type]: value
});

export function ClientSearchInput(props: Props) {
  return (
    <Form
      {...props}
      className={classes['search-field']}
      transoformInitialValues={transoformInitialValues}
      beforeSubmit={beforeSubmit}
    >
      <FormItem name="type">
        <HTMLSelect className={classes['select']} options={options} />
      </FormItem>
      <FormItem name="value">
        <Input
          autoFocus
          rightElement={<Button icon="search" minimal type="submit" />}
        />
      </FormItem>
    </Form>
  );
}
