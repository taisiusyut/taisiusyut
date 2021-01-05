import React from 'react';
import { ITagProps, Tag } from '@blueprintjs/core';

type DivProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

export interface TagsProps extends Omit<DivProps, 'children'> {
  tags?: (ITagProps | string)[];
  tagProps?: ITagProps;
  onTagClick?: (tag: ITagProps, index: number) => void;
}

const getStyle = (space: number) =>
  [{ marginTop: space, marginRight: space }] as const;

const [tagStyle] = getStyle(5);

export function Tags({
  className = '',
  tags = [],
  tagProps,
  onTagClick,
  ...props
}: TagsProps) {
  return (
    <div {...props} className={`tags ${className}`.trim()}>
      {tags.map((_tag, idx) => {
        const tag: ITagProps =
          typeof _tag === 'string'
            ? { children: _tag, interactive: true }
            : _tag;
        const interactive = !!(tag.interactive && onTagClick);

        return (
          <Tag
            intent="primary"
            {...tagProps}
            {...tag}
            key={`${tag}-${idx}`}
            style={tagStyle}
            interactive={interactive}
            onClick={
              interactive
                ? onTagClick && (() => onTagClick(tag, idx))
                : undefined
            }
          />
        );
      })}
    </div>
  );
}
