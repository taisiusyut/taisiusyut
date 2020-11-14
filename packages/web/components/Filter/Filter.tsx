import React, { useEffect, useRef, useState } from 'react';
import router from 'next/router';
import dynamic from 'next/dynamic';
import { Button, Popover, H5, IPopoverProps } from '@blueprintjs/core';
import type { IDateRangeInputProps } from '@blueprintjs/datetime';
import { ButtonPopover } from '@/components/ButtonPopover';
import { Input, SearchInput } from '@/components/Input';
import {
  createForm,
  FormProps,
  FormItemProps,
  DeepPartial
} from '@/utils/form';
import { setSearchParam } from '@/utils/setSearchParam';
import classes from './Filter.module.scss';
import dayjs from 'dayjs';

interface FilterInputProps {
  deps?: undefined;
  placeholder?: string;
}

interface FilterDateRangeProps {
  deps?: undefined;
}

const DateRangeInput = dynamic<IDateRangeInputProps>(() =>
  import(
    /* webpackChunkName: "@blueprintjs/datetime" */ '@blueprintjs/datetime'
  ).then(({ DateRangeInput }) => DateRangeInput)
);

function toDateRange(payload?: string[]) {
  return payload?.map(s => new Date(s));
}

export function createFilter<T extends Record<string, any>>(
  itemProps?: FormItemProps<T>
) {
  const components = createForm<T, T>(itemProps);
  const { Form, FormItem, useForm } = components;
  const setQuery = (params: Record<string, unknown>) =>
    setSearchParam({ ...router.query, ...params });

  function transoformInitialValues({
    createdAt,
    updatedAt,
    ...rest
  }: Record<string, any> = {}) {
    return ({
      ...rest,
      createdAt: toDateRange(createdAt),
      updatedAt: toDateRange(updatedAt)
    } as unknown) as DeepPartial<T>;
  }

  function FilterContent({
    children,
    layout = 'grid',
    initialValues,
    onFinish,
    ...props
  }: FormProps<T> = {}) {
    const [form] = useForm();
    const [values] = useState(transoformInitialValues(initialValues));

    // cannot pass `initialValues` props to `Form`
    // otherwise `form.resetFields()` will not works
    useEffect(() => {
      values && form.setFieldsValue(values);
    }, [values, form]);

    return (
      <div>
        <H5>Filter</H5>
        <Form
          {...props}
          form={form}
          layout={layout}
          onFinish={payload => {
            setSearchParam(payload as Record<string, unknown>);
            onFinish && onFinish(payload);
          }}
        >
          {children}
          <button hidden type="submit" />
        </Form>
        <div className={classes['filter-footer']}>
          <Button onClick={() => form.resetFields()}>Reset</Button>
          <Button intent="primary" onClick={form.submit}>
            Apply
          </Button>
        </div>
      </div>
    );
  }

  function Filter({
    className = '',
    initialValues,
    ...props
  }: FormProps<T> = {}) {
    const [isOpen, setIsOpen] = useState(false);
    const [modifiers, setModifiers] = useState<IPopoverProps['modifiers']>();
    const buttonRef = useRef<HTMLButtonElement>(null);
    const { query } = router;
    const filtered =
      !!Object.keys(query).length &&
      !(query.search || query.pageNo || query.pageSize);

    useEffect(() => {
      function handler() {
        const button = buttonRef.current;
        const layout = document.querySelector<HTMLElement>(
          '.layout .layout-content'
        );
        if (button && layout) {
          const rect = button.getBoundingClientRect();
          const left =
            rect.left -
            layout.getBoundingClientRect().left -
            layout.offsetWidth / 2 +
            14;
          setModifiers({ offset: { offset: `${left * -1}, 0` } });
        }
      }

      if (isOpen) {
        handler();
        const handleClose = () => setIsOpen(false);
        window.addEventListener('resize', handleClose);
        return () => window.removeEventListener('resize', handleClose);
      }
    }, [isOpen]);

    return (
      <Form
        layout="inline"
        className={`${classes['filter']} ${className}`.trim()}
        initialValues={initialValues}
        onFinish={({ search }) => search && setQuery({ search })}
      >
        <FormItem name="search" className={classes['search-input']}>
          <SearchInput
            onClear={() => query.search && setQuery({ search: '' })}
          />
        </FormItem>

        <Button type="submit" icon="search" />

        <Popover
          position="bottom"
          isOpen={isOpen}
          modifiers={modifiers}
          onClose={() => setIsOpen(false)}
          popoverClassName={classes['filter-popover']}
          content={
            <FilterContent
              {...props}
              initialValues={initialValues}
              onFinish={() => setIsOpen(false)}
            />
          }
        >
          <ButtonPopover
            onClick={() => setIsOpen(true)}
            content="Filter"
            intent={filtered ? 'primary' : 'none'}
            icon={filtered ? 'filter-keep' : 'filter'}
            elementRef={buttonRef}
          />
        </Popover>
      </Form>
    );
  }

  function FilterInput({
    placeholder,
    ...props
  }: FormItemProps<T> & FilterInputProps = {}) {
    return (
      <FormItem {...props}>
        <Input placeholder={placeholder} />
      </FormItem>
    );
  }

  function FilterDateRange(
    props: FormItemProps<T> & FilterDateRangeProps = {}
  ) {
    return (
      <FormItem {...props}>
        <DateRangeInput
          className={classes['date-range-input']}
          shortcuts={false}
          allowSingleDayRange
          formatDate={date => dayjs(date).format('YYYY-MM-DD')}
          parseDate={str => new Date(str)}
        />
      </FormItem>
    );
  }

  return {
    ...components,
    Filter,
    FilterInput,
    FilterDateRange
  };
}
