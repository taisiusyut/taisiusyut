import React from 'react';
import { Schema$Book, Category } from '@/typings';
import { Table, TableProps, SortableHeader, Column } from '@/components/Table';
import { BookModel } from '@/components/BookModel';
import { Tags, BookStatusTag } from '@/components/Tags';
import dayjs from 'dayjs';

type BookTableProps = Omit<TableProps<Partial<Schema$Book>>, 'columns'> & {
  isAuthor: boolean;
};

type Columns = (Column<Partial<Schema$Book>> & {
  authorOnly?: boolean;
})[];

const noWrap: React.CSSProperties = { whiteSpace: 'nowrap' };
const numFormat = new Intl.NumberFormat();

function NumberFormat({ value }: { value?: number }) {
  const num = typeof value === 'number' ? numFormat.format(value) : value;
  return <div style={{ textAlign: 'center' }}>{num}</div>;
}

const bookColumns: Columns = [
  {
    id: 'cover',
    Header: '封面',
    accessor: book => {
      const width = 60;
      return (
        <div style={{ width, margin: `5px 5px 5px 10px` }}>
          <BookModel cover={book.cover} width={width} key={book.cover} />
        </div>
      );
    }
  },
  {
    id: 'name',
    accessor: 'name',
    Header: '名稱'
  },
  {
    id: 'status',
    Header: '狀態',
    accessor: ({ status }) => <BookStatusTag status={status} />
  },
  {
    id: 'authorName',
    Header: '作者',
    accessor: book => book.authorName,
    authorOnly: true
  },
  {
    id: 'category',
    Header: '類別',
    accessor: book => book.category && Category[book.category]
  },
  {
    id: 'tags',
    Header: '',
    accessor: book =>
      book.tags ? (
        book.tags.length ? (
          <div style={{ maxWidth: 200, whiteSpace: 'break-spaces' }}>
            <Tags tags={book.tags || []} />
          </div>
        ) : (
          <div>&nbsp;&nbsp;&nbsp;&nbsp;-</div>
        )
      ) : null
  },
  {
    id: 'word-count',
    accessor: 'wordCount',
    Cell: props => <NumberFormat {...props} />,
    Header: () => (
      <SortableHeader field="wordCount" style={noWrap}>
        字數
      </SortableHeader>
    )
  },
  {
    id: 'collection',
    accessor: 'numOfCollection',
    Cell: props => <NumberFormat {...props} />,
    Header: () => <SortableHeader field="numOfCollection">收藏</SortableHeader>
  },
  {
    id: 'createdAt',
    accessor: ({ createdAt }) =>
      createdAt && dayjs(createdAt).format('YYYY-MM-DD HH:mm:ss'),
    Header: () => <SortableHeader field="createdAt">創建時間</SortableHeader>
  },
  {
    id: 'updatedAt',
    accessor: ({ updatedAt }) =>
      updatedAt && dayjs(updatedAt).format('YYYY-MM-DD HH:mm:ss'),
    Header: () => <SortableHeader field="updatedAt">更新時間</SortableHeader>
  }
];

const bookColumnsForAuthor = bookColumns.filter(col => !col.authorOnly);

export function BooksTable({ isAuthor, ...props }: BookTableProps) {
  return (
    <Table {...props} columns={isAuthor ? bookColumnsForAuthor : bookColumns} />
  );
}
