import { ButtonPopover, ButtonPopoverProps } from '@/components/ButtonPopover';
import { withAuthRequired } from '@/components/client/withAuthRequired';
import { useAuthState } from '@/hooks/useAuth';
import { useBookInShelfToggle } from '@/hooks/useBookShelf';

interface Props extends ButtonPopoverProps {
  bookID: string;
}

function BookShelfToggleBase({ bookID, onClick, ...props }: Props) {
  const auth = useAuthState();
  const [exist, loading, toggle] = useBookInShelfToggle(bookID);

  return (
    <ButtonPopover
      {...props}
      minimal
      loading={loading}
      icon={exist ? 'star' : 'star-empty'}
      content={exist ? '移出書架' : '加入書架'}
      onClick={event =>
        auth.loginStatus === 'loggedIn'
          ? toggle(!exist)
          : onClick && onClick(event)
      }
    />
  );
}

export const BookShelfToggle = withAuthRequired(BookShelfToggleBase);
