import React from 'react';
import { AutoSizer } from 'react-virtualized/dist/commonjs/AutoSizer';
import {
  InfiniteLoader,
  InfiniteLoaderProps
} from 'react-virtualized/dist/commonjs/InfiniteLoader';
import {
  List,
  ListProps,
  ListRowRenderer
} from 'react-virtualized/dist/commonjs/List';
import { Schema$Chapter } from '@/typings';
import { ChapterListItem } from './ChapterListItem';
import classes from './ChapterListDrawer.module.scss';

export interface ChapterListContentProps
  extends ListProps,
    Pick<InfiniteLoaderProps, 'loadMoreRows'> {
  bookID: string;
  onItemClick(): void;
  chapters: Partial<Schema$Chapter>[];
}

export function ChapterListContent({
  bookID,
  chapters,
  onItemClick,
  loadMoreRows,
  rowCount,
  ...props
}: ChapterListContentProps) {
  const rowRenderer: ListRowRenderer = ({ key, index, style }) => {
    const chapter = chapters[index];
    return (
      <ChapterListItem
        key={key}
        index={index}
        style={style}
        bookID={bookID}
        chapter={chapter}
        onClick={onItemClick}
      />
    );
  };

  return (
    <div className={classes['list-content']}>
      <AutoSizer>
        {({ height, width }) => (
          <InfiniteLoader
            isRowLoaded={({ index }) => !!chapters[index]?.number}
            loadMoreRows={loadMoreRows}
            rowCount={rowCount}
          >
            {({ onRowsRendered, registerChild }) => {
              return (
                <List
                  {...props}
                  ref={registerChild}
                  width={width}
                  height={height}
                  rowCount={rowCount}
                  rowRenderer={rowRenderer}
                  onRowsRendered={onRowsRendered}
                  scrollToAlignment="start"
                />
              );
            }}
          </InfiniteLoader>
        )}
      </AutoSizer>
    </div>
  );
}
