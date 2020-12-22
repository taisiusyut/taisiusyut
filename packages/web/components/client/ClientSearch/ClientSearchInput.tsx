import React, { useEffect, useRef } from 'react';
import { fromEvent } from 'rxjs';
import { bufferCount, switchMap, takeUntil } from 'rxjs/operators';
import { Button, HTMLSelect } from '@blueprintjs/core';
import { Input } from '@/components/Input';
import { createForm, FormProps } from '@/utils/form';
import classes from './ClientSearch.module.scss';

export interface Store {
  type: string;
  value: string;
}

interface Props extends FormProps<Store> {}

const options = [
  { value: 'search', label: '全部' },
  { value: 'name', label: '書名' },
  { value: 'author', label: '作者' },
  { value: 'tag', label: '標籤' }
];

export const transoform = (query: Record<string, any>) => {
  const types = ['name', 'author', 'tag'];
  for (const type of types) {
    if (typeof query[type] === 'string') {
      return { type, value: query[type] };
    }
  }
  return { type: 'search', value: query.search };
};

const { Form, FormItem, useForm } = createForm<Store>({ noStyle: true });

export { useForm };

export function ClientSearchInput(props: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  // trigger `input.blur()` on scroll, for mobile device
  useEffect(() => {
    const input = inputRef.current;
    if (input) {
      const subscription = fromEvent(input, 'focus')
        .pipe(
          switchMap(() =>
            fromEvent(window, 'scroll').pipe(
              bufferCount(5, 1),
              takeUntil(fromEvent(input, 'blur'))
            )
          )
        )
        .subscribe(() => input.blur());
      return () => subscription.unsubscribe();
    }
  }, []);

  return (
    <Form
      {...props}
      className={classes['search-field']}
      onFinish={payload => {
        props.onFinish && props.onFinish(payload);
        inputRef.current?.blur();
      }}
    >
      <FormItem name="type">
        <HTMLSelect className={classes['select']} options={options} />
      </FormItem>
      <FormItem name="value">
        <Input
          autoFocus
          inputRef={inputRef}
          rightElement={<Button icon="search" minimal type="submit" />}
        />
      </FormItem>
    </Form>
  );
}
