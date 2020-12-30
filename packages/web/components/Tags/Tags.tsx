import React from 'react';
import { ITagProps, Tag } from '@blueprintjs/core';

type DivProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

interface TagOption {
  value: string;
  clickable?: boolean;
}

interface Props extends Omit<DivProps, 'children'> {
  tags?: (TagOption | string)[];
  tagProps?: ITagProps;
  onTagClick?: (tag: TagOption, index: number) => void;
}

const getStyle = (space: number) =>
  [
    { marginTop: -space, marginLeft: -space },
    { marginTop: space, marginRight: space }
  ] as const;

const [tagsStyle, tagStyle] = getStyle(5);

export function Tags({
  className = '',
  tags = [],
  tagProps,
  onTagClick,
  ...props
}: Props) {
  return (
    <div {...props} className={`tags ${className}`.trim()} style={tagsStyle}>
      {tags.map((_tag, idx) => {
        const tag =
          typeof _tag === 'string' ? { value: _tag, clickable: true } : _tag;
        const interactive = !!(tag.clickable && onTagClick);

        return (
          <Tag
            {...tagProps}
            key={`${tag}-${idx}`}
            style={tagStyle}
            interactive={interactive}
            onClick={onTagClick && (() => onTagClick(tag, idx))}
          >
            {tag.value}
          </Tag>
        );
      })}
    </div>
  );
}
