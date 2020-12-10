import { ButtonPopover, ButtonPopoverProps } from '@/components/ButtonPopover';
import { useAuthState } from '@/hooks/useAuth';
import { useBookInShelfToggle } from '@/hooks/useBookShelf';

interface Props extends ButtonPopoverProps {
  bookID: string;
}

export function BookShelfToggle({ bookID, ...props }: Props) {
  const auth = useAuthState();
  const [exist, loading, toggle] = useBookInShelfToggle(bookID);

  return (
    <ButtonPopover
      {...props}
      minimal
      loading={loading}
      icon={exist ? 'star' : 'star-empty'}
      content={exist ? '移出書架' : '加入書架'}
      onClick={() => (auth.loginStatus === 'loggedIn' ? toggle(!exist) : null)}
    />
  );
}
