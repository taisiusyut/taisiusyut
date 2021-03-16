import React, { useEffect, useRef, useState } from 'react';
import router from 'next/router';
import { Button, Popover, IPopoverProps, H4 } from '@blueprintjs/core';
import { ButtonPopover } from '@/components/ButtonPopover';
import { DateRangeInput } from '@/components/Input/DateRangeInput';
import { Input, SearchInput } from '@/components/Input';
import {
  createForm,
  FormProps,
  FormItemProps,
  DeepPartial,
  FormInstance
} from '@/utils/form';
import { setSearchParam } from '@/utils/setSearchParam';
import { setRef } from '@/utils/setRef';
import classes from './Filter.module.scss';

interface FilterInputProps {
  deps?: undefined;
  placeholder?: string;
}

interface FilterDateRangeProps {
  deps?: undefined;
}

function toDateRange(payload?: string[]) {
  return payload?.map(s => new Date(s));
}

const title = `篩選`;

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
      const formRef = useRef<FormInstance<T>>(null);
      const [values] = useState(transoformInitialValues(initialValues));

      // cannot pass `initialValues` props to `Form`
      // otherwise `form.resetFields()` will not "clear the values"
      useEffect(() => {
        values && formRef.current?.setFieldsValue(values);
      }, [values]);

      return (
        <div>
          <H4 style={{ marginBottom: 20 }}>{title}</H4>

          <Form
            {...props}
            layout={layout}
            ref={setRef(ref, formRef)}
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
              Clear
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

        const handleClose = () => setIsOpen(false);
        window.addEventListener('resize', handleClose);
        return () => window.removeEventListener('resize', handleClose);
      }
    }, [isOpen]);

    useEffect(() => setIsOpen(false), []);

    useEffect(() => {
      initialValues && formRef.current?.setFieldsValue(initialValues);
      setFiltered(hasFilter(initialValues));
    }, [initialValues]);

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
            content={title}
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
          className={classes['date-range-input']}
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
