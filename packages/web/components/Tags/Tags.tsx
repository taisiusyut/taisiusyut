import React from 'react';
import { ITagProps, Tag } from '@blueprintjs/core';

interface Props
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  tags?: string[];
  tagProps?: ITagProps;
  onTagClick?: (tag: string, index: number) => void;
}

const getStyle = (space: number) =>
  [
    { marginTop: -space, marginLeft: -space },
    { marginTop: space, marginLeft: space }
  ] as const;

const [tagsStyle, tagStyle] = getStyle(5);

export function Tags({
  className = '',
  tags = [],
  tagProps,
  onTagClick,
  children,
  ...props
}: Props) {
  return (
    <div {...props} className={`tags ${className}`.trim()} style={tagsStyle}>
      {children}
      {tags.map((tag, idx) => (
        <Tag
          {...tagProps}
          style={tagStyle}
          key={`${tag}-${idx}`}
          interactive={!!onTagClick}
          onClick={() => onTagClick && onTagClick(tag, idx)}
        >
          {tag}
        </Tag>
      ))}
    </div>
  );
}
