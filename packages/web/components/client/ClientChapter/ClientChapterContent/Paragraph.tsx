import { HTMLAttributes } from 'react';

interface ParagraphProps extends HTMLAttributes<HTMLParagraphElement> {
  content: string | string[];
}

function Node({ content }: { content: string }) {
  const [, type, value, closeTag] =
    content.match(/\[(.*?)\](.*?)\[\/(.*?)\]/) || [];

  if (type && value && type === closeTag) {
    switch (type) {
      case 'img':
        return <img src={value} alt="" />;
    }
  }

  return <span>{content}</span>;
}

export function Paragraph({ content, ...props }: ParagraphProps) {
  const node =
    typeof content === 'string' ? (
      <Node content={content} />
    ) : (
      content.map(content => <Node key={content} content={content} />)
    );

  return <p {...props}>{node}</p>;
}
