import React, { useState } from 'react';
import router from 'next/router';
import { useRxAsync } from 'use-rx-hooks';
import { AutoSizer } from 'react-virtualized/dist/commonjs/AutoSizer';
import { List, ListRowRenderer } from 'react-virtualized/dist/commonjs/List';
import { Drawer, IDrawerProps } from '@blueprintjs/core';
import { ButtonPopover } from '@/components/ButtonPopover';
import { getChapters } from '@/service';
import { Order, PaginateResult, Schema$Chapter } from '@/typings';
import { Toaster } from '@/utils/toaster';
import { ChapterListItem } from './ChapterListItem';
import classes from './ChapterListDrawer.module.scss';
import 'react-virtualized/styles.css';

export interface ChapterListDrawerProps extends IDrawerProps {
  bookID: string;
  bookName: string;
  chapterNo: number;
}

const onFailure = Toaster.apiError.bind(Toaster, 'Get chapters failure');

export function ChapterListDrawer({
  bookID,
  bookName,
  chapterNo,
  ...props
}: ChapterListDrawerProps) {
  const [chapters, setChapters] = useState<Partial<Schema$Chapter>[]>(
    Array.from({ length: 30 }, () => ({}))
  );

  const rowCount = chapters.length;

  const rowRenderer: ListRowRenderer = ({ key, index, style }) => {
    const chapter = chapters[index];
    return (
      <ChapterListItem
        key={key}
        style={style}
        chapter={chapter}
        onClick={event => {
          if (chapter.number) {
            props.onClose && props.onClose(event);
            router.push(`/book/${bookName}/chapter/${chapter.number}`);
          }
        }}
        isActive={chapter.number === chapterNo}
      />
    );
  };

  const [{ request, onSuccess }] = useState(() => {
    return {
      request: () =>
        getChapters({
          bookID,
          pageSize: 9999,
          sort: { createdAt: Order.ASC }
        }),
      onSuccess: (payload: PaginateResult<Schema$Chapter>) => {
        setChapters(payload.data);
      }
    };
  });

  const [{ loading }] = useRxAsync(request, {
    defer: !props.isOpen,
    onSuccess,
    onFailure
  });

  return (
    <Drawer {...props} size="auto">
      <div className={classes['header']}>
        <div className={classes['header-title']}>章節目錄</div>
        <ButtonPopover
          minimal
          content="切換順序"
          icon="swap-vertical"
          onClick={() => setChapters(chapters => chapters.slice().reverse())}
        />
      </div>
      <div className={classes['list-content']} style={{ overflow: 'hidden' }}>
        <AutoSizer>
          {({ height, width }) => (
            <List
              {...props}
              width={width}
              height={height}
              rowHeight={55}
              rowCount={rowCount}
              rowRenderer={rowRenderer}
              noRowsRenderer={loading ? undefined : () => <div>empty</div>}
              scrollToIndex={(chapters[chapterNo - 1]?.number || 1) - 2}
              scrollToAlignment="start"
            />
          )}
        </AutoSizer>
      </div>
    </Drawer>
  );
}
