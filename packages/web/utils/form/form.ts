/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types */

import React, { ReactElement, ReactNode } from 'react';
import RcForm, { Field as RcField, useForm as RcUseForm } from 'rc-field-form';
import { FormGroup, IFormGroupProps } from '@blueprintjs/core';
import { FormProps as RcFormProps } from 'rc-field-form/es/Form';
import { FieldProps as RcFieldProps } from 'rc-field-form/es/Field';
import { Meta, FieldError, Store } from 'rc-field-form/lib/interface';
import { Validator, compose as composeValidator } from './validators';
import { NamePath, Paths, PathType, DeepPartial, Control } from './typings';

type HTMLDivProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

export interface FieldData<S extends {} = Store, Name = NamePath<S>>
  extends Partial<Omit<Meta, 'name'>> {
  name: Name;
  value?: Name extends Paths<S>
    ? PathType<S, Name>
    : Name extends keyof S
    ? S[Name]
    : undefined;
}

export type FormInstance<S extends {} = Store> = {
  getFieldValue<K extends keyof S>(name: K): S[K];
  getFieldValue<T extends Paths<S>>(name: T): PathType<S, T>;
  getFieldsValue(nameList?: NamePath<S>[]): S;
  getFieldError(name: NamePath<S>): string[];
  getFieldsError(nameList?: NamePath<S>[]): FieldError[];
  isFieldsTouched(
    nameList?: NamePath<S>[],
    allFieldsTouched?: boolean
  ): boolean;
  isFieldsTouched(allFieldsTouched?: boolean): boolean;
  isFieldTouched(name: NamePath<S>): boolean;
  isFieldValidating(name: NamePath<S>): boolean;
  isFieldsValidating(nameList: NamePath<S>[]): boolean;
  resetFields(fields?: NamePath<S>[]): void;
  setFields(fields: FieldData<S, keyof S | NamePath<S>>[]): void;
  setFieldsValue(value: DeepPartial<S>): void;
  validateFields<K extends keyof S>(nameList?: NamePath<K>[]): Promise<S>;
  submit: () => void;
};

export interface FormProps<S extends {} = Store, V = S>
  extends Omit<RcFormProps, 'form' | 'onFinish' | 'onValuesChange'> {
  form?: FormInstance<S>;
  initialValues?: DeepPartial<V>;
  onFinish?: (values: V) => void;
  onValuesChange?: (changes: DeepPartial<S>, values: S) => void;
  ref?: React.Ref<FormInstance<S>>;
  transoformInitialValues?: (payload: DeepPartial<V>) => DeepPartial<S>;
  beforeSubmit?: (payload: S) => V;
  layout?: 'vertical' | 'hrozional' | 'inline' | 'grid';
}

type OmititedRcFieldProps = Omit<
  RcFieldProps,
  'name' | 'dependencies' | 'children' | 'rules'
>;

export interface FormItemLabelProps extends HTMLDivProps {
  label?: ReactNode;
}

interface BasicFormItemProps<S extends {} = Store>
  extends OmititedRcFieldProps {
  name?: NamePath<S>;
  children?: ReactElement | ((value: S) => ReactElement);
  validators?:
    | Array<Validator | null>
    | ((value: S) => Array<Validator | null>);
  label?: ReactNode;
  noStyle?: boolean;
  className?: string;
}

type Deps<S> = Array<NamePath<S>>;
type FormItemPropsDeps<S extends {} = Store> =
  | {
      deps?: Deps<S>;
      children?: ReactElement;
      validators?: Array<Validator | null>;
    }
  | {
      deps: Deps<S>;
      validators: (value: S) => Array<Validator | null>;
    }
  | {
      deps: Deps<S>;
      children: (value: S) => ReactElement;
    };

export type FormItemProps<S extends {} = Store> = BasicFormItemProps<S> &
  FormItemPropsDeps<S> &
  Pick<IFormGroupProps, 'label' | 'inline'>;

export interface FormItemClassName {
  item?: string;
  error?: string;
  touched?: string;
  validating?: string;
  help?: string;
}

type Rule = NonNullable<RcFieldProps['rules']>[number];

const getValues = (obj: any, paths: (string | number)[]) =>
  paths.reduce((result, key) => result && result[key], obj);

export function createShouldUpdate(
  names: Array<string | number | (string | number)[]> = []
): RcFieldProps['shouldUpdate'] {
  return (prev, curr) => {
    for (const name of names) {
      const paths = Array.isArray(name) ? name : [name];
      if (getValues(prev, paths) !== getValues(curr, paths)) {
        return true;
      }
    }
    return false;
  };
}

const defaultFormItemClassName: Required<FormItemClassName> = {
  item: 'rc-form-item',
  error: 'rc-form-item-error',
  touched: 'rc-form-item-touched',
  validating: 'rc-form-item-validating',
  help: 'rc-form-item-help'
};

export function createForm<S extends {} = Store, V = S>({
  itemClassName,
  ...defaultProps
}: Partial<FormItemProps<S>> & { itemClassName?: FormItemClassName } = {}) {
  const ClassNames = { ...defaultFormItemClassName, ...itemClassName };

  const FormItem = (itemProps: FormItemProps<S>) => {
    const {
      name,
      children,
      validators = [],
      deps = [],
      noStyle,
      label,
      inline,
      className = '',
      ...props
    } = {
      ...defaultProps,
      ...itemProps
    } as FormItemProps<S> & {
      deps?: Array<string | number | (string | number)[]>;
      name: string | number;
    };

    const rules: Rule[] = [
      typeof validators === 'function'
        ? ({ getFieldsValue }) => ({
            validator: composeValidator(validators(getFieldsValue(deps) as S))
          })
        : { validator: composeValidator(validators) }
    ];

    return React.createElement(
      RcField,
      {
        name,
        rules,
        ...(deps.length
          ? { dependencies: deps, shouldUpdate: createShouldUpdate(deps) }
          : {}),
        ...props
      },
      (
        control: Control<unknown>,
        { touched, validating, errors }: FieldData<S>,
        form: FormInstance<S>
      ) => {
        const { getFieldsValue } = form;

        const error = errors && errors[0];

        const childNode =
          typeof children === 'function'
            ? children(getFieldsValue(deps))
            : name
            ? React.cloneElement(children as React.ReactElement, {
                ...control
              })
            : children;

        if (noStyle) {
          return childNode;
        }

        return React.createElement<IFormGroupProps>(
          FormGroup,
          {
            label,
            inline,
            className: [
              className,
              ClassNames.item,
              error && ClassNames.error,
              touched && ClassNames.touched,
              validating && ClassNames.validating
            ]
              .filter(Boolean)
              .join(' ')
              .trim()
          },
          childNode,
          React.createElement<HTMLDivProps>(
            'div',
            { className: ClassNames.help },
            error
          )
        );
      }
    );
  };

  const Form = React.forwardRef<FormInstance<S>, FormProps<S, V>>(
    (
      {
        layout = 'vertical',
        className = '',
        children,
        onFinish,
        beforeSubmit,
        initialValues,
        transoformInitialValues,
        ...props
      },
      ref
    ) =>
      React.createElement(
        RcForm,
        {
          ...props,
          ref,
          className: `rc-form ${layout} ${className}`.trim(),
          initialValues:
            initialValues && transoformInitialValues
              ? transoformInitialValues(initialValues)
              : initialValues,
          onFinish:
            onFinish &&
            ((store: unknown) => {
              onFinish(beforeSubmit ? beforeSubmit(store as S) : (store as V));
            })
        } as RcFormProps,
        children
      )
  );

  const useForm: () => [FormInstance<S>] = RcUseForm as any;

  return {
    Form,
    FormItem,
    FormList: RcForm.List,
    FormProvider: RcForm.FormProvider,
    useForm
  };
}
