import React, { useEffect, useRef, useState } from 'react';
import router from 'next/router';
import { fromEvent } from 'rxjs';
import { Button, Popover, H5, IPopoverProps } from '@blueprintjs/core';
import { useBoolean } from '@/hooks/useBoolean';
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

interface FilterInputProps {
  deps?: undefined;
  placeholder?: string;
}

interface FilterDateRangeProps {
  deps?: undefined;
}

export function createFilter<T extends Record<string, any>>(
  itemProps?: FormItemProps<T>
) {
  const components = createForm<T, T>(itemProps);
  const { Form, FormItem, useForm } = components;
  const setQuery = (params: Record<string, unknown>) =>
    setSearchParam({ ...router.query, ...params });

  function FilterContent({
    children,
    layout = 'grid',
    initialValues,
    onFinish,
    ...props
  }: FormProps<T> = {}) {
    const [form] = useForm();

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

  function Filter({ className = '', ...props }: FormProps<T> = {}) {
    const [isOpen, open, close] = useBoolean();
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
        const subscription = fromEvent(window, 'resize').subscribe(close);
        return () => subscription.unsubscribe();
      }
    }, [isOpen, close]);

    return (
      <Form
        layout="inline"
        className={`${classes['filter']} ${className}`.trim()}
        initialValues={({ search: query.search } as unknown) as DeepPartial<T>}
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
          onClose={close}
          modifiers={modifiers}
          popoverClassName={classes['filter-popover']}
          content={<FilterContent {...props} onFinish={close} />}
        >
          <ButtonPopover
            onClick={open}
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
        {/* <DateRangeInput
          className="date-range-input"
          shortcuts={false}
          allowSingleDayRange
          formatDate={date => dayjs(date).format('YYYY-MM-DD')}
          parseDate={str => new Date(str)}
        /> */}
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
