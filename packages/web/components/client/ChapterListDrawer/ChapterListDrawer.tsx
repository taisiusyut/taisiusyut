import React, { useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { Drawer, IDrawerProps } from '@blueprintjs/core';
import { AutoSizer } from 'react-virtualized/dist/commonjs/AutoSizer';
import {
  InfiniteLoader,
  InfiniteLoaderProps
} from 'react-virtualized/dist/commonjs/InfiniteLoader';
import { List, ListRowRenderer } from 'react-virtualized/dist/commonjs/List';
import { ButtonPopover } from '@/components/ButtonPopover';
import { getChapters } from '@/service';
import { Order, Schema$Chapter } from '@/typings';
import { ChapterListItem } from './ChapterListItem';
import {
  createCRUDReducer,
  DefaultCRUDActionTypes
} from '@/hooks/crud-reducer';
import 'react-virtualized/styles.css';
import classes from './ChapterListDrawer.module.scss';

interface Props extends IDrawerProps {
  bookID: string;
  chapterNo: number;
}

const rowHeight = 50;
const getPageSize = () =>
  typeof window === 'undefined'
    ? 10
    : Math.ceil((window.screen.height * 2) / rowHeight);

const [initialState, reducer] = createCRUDReducer<Schema$Chapter, 'id'>('id', {
  actionTypes: DefaultCRUDActionTypes
});

export function ChapterListDrawer({
  bookID,
  chapterNo,
  isOpen,
  ...props
}: Props) {
  const [pageSize, setPageSize] = useState(getPageSize);
  const [state, dispatch] = useReducer(reducer, initialState, state => ({
    ...state,
    pageSize
  }));

  const loading = useRef<Record<number, boolean>>({});

  const rowCount = state.total;

  const { handleGetChapters, loadMoreRows } = useMemo(() => {
    const handleGetChapters = async (pageNo: number) => {
      if (!loading.current[pageNo]) {
        loading.current[pageNo] = true;
        const payload = await getChapters({
          bookID,
          pageNo,
          pageSize,
          sort: { createdAt: Order.ASC }
        });
        dispatch({ type: DefaultCRUDActionTypes.PAGINATE, payload });
      }
    };

    const loadMoreRows: InfiniteLoaderProps['loadMoreRows'] = params => {
      const pageNo = Math.ceil((params.stopIndex + 1) / pageSize);
      return handleGetChapters(pageNo);
    };

    return { handleGetChapters, loadMoreRows };
  }, [bookID, dispatch, pageSize]);

  const rowRenderer: ListRowRenderer = ({ key, index, style }) => {
    const chapter = state.list[index];
    return (
      <ChapterListItem
        key={key}
        index={index}
        style={style}
        bookID={bookID}
        chapter={chapter}
        onClick={() => void 0}
        isActive={index === chapterNo - 1}
      />
    );
  };

  const isRowLoaded: InfiniteLoaderProps['isRowLoaded'] = ({ index }) =>
    !!state.list[index]?.number;

  useEffect(() => {
    if (isOpen) {
      // Note: changing pageSize will reset crud reducer, so it should not change frequently
      const pageSize = getPageSize();
      setPageSize(pageSize);

      handleGetChapters(Math.ceil(chapterNo / pageSize));
    }
  }, [isOpen, chapterNo, handleGetChapters]);

  return (
    <Drawer {...props} size="auto" isOpen={isOpen}>
      <div className={classes['header']}>
        <div className={classes['header-title']}>章節目錄</div>
        <ButtonPopover minimal content="切換順序" icon="swap-vertical" />
      </div>
      <div className={classes['list-content']}>
        <AutoSizer>
          {({ height, width }) => (
            <InfiniteLoader
              rowCount={rowCount}
              isRowLoaded={isRowLoaded}
              loadMoreRows={loadMoreRows}
              threshold={pageSize / 2}
            >
              {({ onRowsRendered, registerChild }) => {
                return (
                  <List
                    {...props}
                    ref={registerChild}
                    width={width}
                    height={height}
                    rowHeight={rowHeight}
                    rowCount={state.total || 1}
                    rowRenderer={rowRenderer}
                    onRowsRendered={onRowsRendered}
                    scrollToIndex={chapterNo - 2}
                    scrollToAlignment="start"
                  />
                );
              }}
            </InfiniteLoader>
          )}
        </AutoSizer>
      </div>
    </Drawer>
  );
}
