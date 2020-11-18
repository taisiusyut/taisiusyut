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
  DeepPartial,
  FormInstance
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
  const { Form, FormItem } = components;

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

  const FilterContent = React.forwardRef<FormInstance<T>, FormProps<T>>(
    ({ children, layout = 'grid', initialValues, onFinish, ...props }, ref) => {
      const formRef = useRef<FormInstance<T> | null>();
      const [values] = useState(transoformInitialValues(initialValues));

      // cannot pass `initialValues` props to `Form`
      // otherwise `form.resetFields()` will not works
      useEffect(() => {
        values && formRef.current?.setFieldsValue(values);
      }, [values]);

      return (
        <div>
          <H5>Filter</H5>
          <Form
            {...props}
            layout={layout}
            ref={form => {
              formRef.current = form;
              if (typeof ref === 'function') ref(form);
              else if (ref) ref.current = form;
            }}
            onFinish={payload => {
              setSearchParam(payload as Record<string, unknown>);
              onFinish && onFinish(payload);
            }}
          >
            {children}
            <button hidden type="submit" />
          </Form>
          <div className={classes['filter-footer']}>
            <Button
              onClick={() => {
                formRef.current?.resetFields();
                formRef.current?.submit();
              }}
            >
              Reset
            </Button>
            <Button intent="primary" onClick={formRef.current?.submit}>
              Apply
            </Button>
          </div>
        </div>
      );
    }
  );

  function hasFilter(values?: DeepPartial<T> | T) {
    return (
      !!values &&
      Object.values(values).some(value => typeof value !== 'undefined')
    );
  }

  function Filter({
    className = '',
    initialValues,
    ...props
  }: FormProps<T> = {}) {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const formRef = useRef<FormInstance<T>>(null);
    const [modifiers, setModifiers] = useState<IPopoverProps['modifiers']>();
    const [filtered, setFiltered] = useState(false);

    // make sure render filter content immediately
    const [isOpen, setIsOpen] = useState(true);

    useEffect(() => {
      function handler() {
        const button = buttonRef.current;
        const layout = document.querySelector<HTMLElement>(
          '.layout .layout-content'
        );
        if (button && layout) {
          const left =
            button.getBoundingClientRect().left -
            layout.getBoundingClientRect().left -
            layout.offsetWidth / 2 +
            13;
          setModifiers({ offset: { offset: `${left * -1}, 0` } });
        }
      }

      if (isOpen) {
        handler();

        // wait for filter content mount
        setTimeout(() => {
          const values = formRef.current?.getFieldsValue();
          setFiltered(hasFilter(values));
        }, 0);

        const handleClose = () => setIsOpen(false);
        window.addEventListener('resize', handleClose);
        return () => window.removeEventListener('resize', handleClose);
      }
    }, [isOpen]);

    useEffect(() => setIsOpen(false), []);

    return (
      <Form
        layout="inline"
        className={`${classes['filter']} ${className}`.trim()}
        initialValues={initialValues}
        onFinish={({ search }) =>
          (router.query.search || search) &&
          setSearchParam(params => ({ ...params, search }))
        }
      >
        <FormItem name="search" className={classes['search-input']}>
          <SearchInput
            onClear={() =>
              router.query.search &&
              setSearchParam(params => ({ ...params, search: '' }))
            }
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
              ref={formRef}
              initialValues={initialValues}
              onFinish={values => {
                setIsOpen(false);
                setFiltered(hasFilter(values));
              }}
            />
          }
        >
          <ButtonPopover
            content="Filter"
            elementRef={buttonRef}
            intent={filtered ? 'primary' : 'none'}
            icon={filtered ? 'filter-keep' : 'filter'}
            onClick={() => setIsOpen(true)}
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
          allowSingleDayRange
          shortcuts={false}
          className={classes['date-range-input']}
          formatDate={date => dayjs(date).format('YYYY-MM-DD')}
          parseDate={str => new Date(str)}
          popoverProps={{ fill: true }}
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
