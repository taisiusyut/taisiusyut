import React from 'react';
import { ButtonPopover, ButtonPopoverProps } from '@/components/ButtonPopover';
import { withAuthRequired } from '@/components/client/withAuthRequired';
import { useBookInShelfToggle } from '@/hooks/useBookShelf';

interface Props extends ButtonPopoverProps {
  bookID: string;
}

const TriggerButton = withAuthRequired(ButtonPopover);

export function BookShelfToggle({ bookID, ...props }: Props) {
  const [exist, loading, toggle] = useBookInShelfToggle(bookID);
  return (
    <TriggerButton
      {...props}
      minimal
      loading={loading}
      icon={exist ? 'star' : 'star-empty'}
      content={exist ? '移出書架' : '加入書架'}
      onClick={() => toggle(!exist)}
    />
  );
}
