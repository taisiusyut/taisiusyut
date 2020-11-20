import React from 'react';
import { ITagProps, Tag } from '@blueprintjs/core';

interface Props
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  tags: string[];
  tagProps?: ITagProps;
}

const getStyle = (space: number) =>
  [
    { marginTop: -space, marginLeft: -space },
    { marginTop: space, marginLeft: space }
  ] as const;

const [tagsStyle, tagStyle] = getStyle(5);

export function Tags({ className = '', tags, tagProps, ...props }: Props) {
  return (
    <div {...props} className={`tags ${className}`.trim()} style={tagsStyle}>
      {tags.map((tag, idx) => (
        <Tag {...tagProps} style={tagStyle} key={`${tag}-${idx}`}>
          {tag}
        </Tag>
      ))}
    </div>
  );
}
