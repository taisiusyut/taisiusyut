import React from 'react';
import { ButtonPopover, ButtonPopoverProps } from '@/components/ButtonPopover';
import { withAuthRequired } from '@/components/client/withAuthRequired';
import { useBookInShelfToggle } from '@/hooks/useBookShelf';

interface Props
  extends Omit<ButtonPopoverProps, 'icon' | 'content' | 'text' | 'children'> {
  bookID: string;
  icon?: boolean;
}

const TriggerButton = withAuthRequired(ButtonPopover);

export function BookShelfToggle({ bookID, icon, ...props }: Props) {
  const [exist, loading, toggle] = useBookInShelfToggle(bookID);
  const text = exist ? '移出書架' : '加入書架';

  return (
    <TriggerButton
      {...props}
      {...(icon ? { content: text } : { text })}
      icon={icon ? (exist ? 'star' : 'star-empty') : undefined}
      loading={loading}
      onClick={() => toggle(!exist)}
    />
  );
}
