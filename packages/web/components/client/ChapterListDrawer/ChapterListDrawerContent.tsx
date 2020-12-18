import React, { useRef } from 'react';
import { AutoSizer } from 'react-virtualized/dist/commonjs/AutoSizer';
import { List, ListRowRenderer } from 'react-virtualized/dist/commonjs/List';
import { ButtonPopover } from '@/components/ButtonPopover';
import { Schema$Chapter } from '@/typings';
import { ChapterListItem } from './ChapterListItem';
import classes from './ChapterListDrawer.module.scss';
import 'react-virtualized/styles.css';

export interface ChapterListDrawerContentProps {
  bookID: string;
  chapterNo: number;
  loading?: boolean;
  chapters: Partial<Schema$Chapter>[];
  onReverse: () => void;
  onItemClick: (chapter: Partial<Schema$Chapter>) => void;
}

export function ChapterListDrawerContent({
  bookID,
  chapterNo,
  chapters,
  loading,
  onReverse,
  onItemClick,
  ...props
}: ChapterListDrawerContentProps) {
  const listRef = useRef<List>(null);
  const rowCount = chapters.length;

  const rowRenderer: ListRowRenderer = ({ key, index, style }) => {
    const chapter = chapters[index];
    return (
      <ChapterListItem
        key={key}
        style={style}
        chapter={chapter}
        onClick={() => onItemClick(chapter)}
        isActive={chapter.number === chapterNo}
      />
    );
  };

  return (
    <>
      <div className={classes['header']}>
        <div className={classes['header-title']}>章節目錄</div>
        <ButtonPopover
          minimal
          content="切換順序"
          icon="swap-vertical"
          onClick={() => {
            onReverse();
            listRef.current?.scrollToPosition(0);
          }}
        />
      </div>
      <div className={classes['list-content']} style={{ overflow: 'hidden' }}>
        <AutoSizer>
          {({ height, width }) => (
            <List
              {...props}
              ref={listRef}
              width={width}
              height={height}
              rowHeight={55}
              rowCount={rowCount}
              rowRenderer={rowRenderer}
              noRowsRenderer={loading ? undefined : () => <div>empty</div>}
              scrollToIndex={chapterNo - 2}
              scrollToAlignment="start"
            />
          )}
        </AutoSizer>
      </div>
    </>
  );
}
