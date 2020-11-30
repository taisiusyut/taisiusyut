// https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/react-table#example-type-file

import {
  UsePaginationInstanceProps,
  UsePaginationOptions,
  UsePaginationState,
  UseRowSelectHooks,
  UseRowSelectInstanceProps,
  UseRowSelectOptions,
  UseRowSelectRowProps,
  UseRowSelectState
} from 'react-table';

declare module 'react-table' {
  export interface TableOptions<D extends Record<string, unknown>>
    extends UsePaginationOptions<D>,
      UseRowSelectOptions<D> {}

  export interface Hooks<
    D extends Record<string, unknown> = Record<string, unknown>
  > extends UseRowSelectHooks<D> {}

  export interface TableInstance<
    D extends Record<string, unknown> = Record<string, unknown>
  > extends UsePaginationInstanceProps<D>,
      UseRowSelectInstanceProps<D> {}

  export interface TableState<
    D extends Record<string, unknown> = Record<string, unknown>
  > extends UsePaginationState<D>,
      UseRowSelectState<D> {}

  export interface Row<
    D extends Record<string, unknown> = Record<string, unknown>
  > extends UseRowSelectRowProps<D> {}
}
