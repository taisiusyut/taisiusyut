import React, { useReducer, Reducer, useEffect } from 'react';
import { Button, ButtonGroup, Intent } from '@blueprintjs/core';
import classNames from './Pagination.module.scss';

// Credit:
// https://github.com/palantir/blueprint/issues/1029

export interface PaginationProps {
  pageNo?: number;
  total?: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
}

interface InitialState {
  currentPage: number;
  pageSize: number;
  total: number;
}

interface State extends InitialState {
  pages: number[];
  totalPages: number;
}

type Actions =
  | { type: 'PAGE_CHANGE'; payload: number }
  | { type: 'INIT'; payload: Partial<InitialState> };

const getState = ({ currentPage, pageSize, total }: InitialState): State => {
  const totalPages = Math.ceil(total / pageSize);

  // create an array of pages to ng-repeat in the pager control
  let startPage = 0,
    endPage = 0;
  if (totalPages <= 9) {
    // less than 10 total pages so show all
    startPage = 1;
    endPage = totalPages;
  } else {
    // more than 10 total pages so calculate start and end pages
    if (currentPage <= 6) {
      startPage = 1;
      endPage = 9;
    } else if (currentPage + 4 >= totalPages) {
      startPage = totalPages - 8;
      endPage = totalPages;
    } else {
      startPage = currentPage - 5;
      endPage = currentPage + 3;
    }
  }

  const pages = Array.from(
    { length: endPage + 1 - startPage },
    (_, i) => startPage + i
  );

  // Too large or small currentPage
  let correctCurrentpage = currentPage;
  if (currentPage > totalPages) correctCurrentpage = totalPages;
  if (currentPage <= 0) correctCurrentpage = 1;

  return {
    currentPage: correctCurrentpage,
    pageSize,
    total,
    pages,
    totalPages
  };
};

const reducer: Reducer<State, Actions> = (state, action) => {
  switch (action.type) {
    case 'PAGE_CHANGE':
      return getState({
        ...state,
        currentPage: action.payload
      });

    case 'INIT':
      return getState({
        ...state,
        ...action.payload
      });

    default:
      throw new Error();
  }
};

export const Pagination = React.memo<PaginationProps>(
  ({ pageNo = 1, pageSize = 10, total = 0, onPageChange }) => {
    const [state, dispatch] = useReducer(
      reducer,
      { currentPage: pageNo, total, pageSize },
      getState
    );

    useEffect(() => {
      dispatch({
        type: 'INIT',
        payload: { currentPage: pageNo, total, pageSize }
      });
    }, [dispatch, pageNo, total, pageSize]);

    const changePage = (page: number) => {
      dispatch({ type: 'PAGE_CHANGE', payload: page });
      onPageChange(page);
    };

    return (
      <div className={classNames.pagiation}>
        <ButtonGroup>
          <Button
            disabled={state.currentPage === 1}
            onClick={() => changePage(1)}
          >
            First
          </Button>
          <Button
            icon="chevron-left"
            disabled={state.currentPage === 1}
            onClick={() => changePage(Math.max(1, state.currentPage - 1))}
          />
          {state.pages.map(page => (
            <Button
              className="page-no"
              key={page}
              intent={state.currentPage === page ? Intent.PRIMARY : Intent.NONE}
              onClick={() => changePage(page)}
            >
              {page}
            </Button>
          ))}
          <Button
            icon="chevron-right"
            disabled={state.currentPage === state.totalPages}
            onClick={() =>
              changePage(Math.min(state.currentPage + 1, state.totalPages))
            }
          />
          <Button
            disabled={state.currentPage === state.totalPages}
            onClick={() => changePage(state.totalPages)}
          >
            Last
          </Button>
        </ButtonGroup>
      </div>
    );
  }
);
