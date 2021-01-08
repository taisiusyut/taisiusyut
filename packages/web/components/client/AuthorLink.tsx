import React from 'react';
import Link from 'next/link';

type AnchorProps = React.DetailedHTMLProps<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
>;

interface Props extends AnchorProps {
  authorName?: string;
}

export function AuthorLink({
  authorName,
  className,
  children = authorName,
  ...props
}: Props) {
  if (authorName) {
    return (
      <Link href={`/author/${authorName}`} prefetch={false}>
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <a {...props} className={`link ${className}`.trim()}>
          {children}
        </a>
      </Link>
    );
  }

  return null;
}
