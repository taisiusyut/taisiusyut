import { ClientHeader } from '@/components/client/ClientLayout';
import { withDesktopHeaderBtn } from '@/components/BlankButton';
import { ButtonPopover } from '@/components/ButtonPopover';
import {
  withMainMenuOverLay,
  MainMenuOverlayIcon,
  MainMenuOverlayTitle
} from '@/components/client/MainMenuOverlay';
import { useBookShelfState } from '@/hooks/useBookShelf';
import { useAuthState } from '@/hooks/useAuth';
import { BookShelfItem } from './BookShelfItem';
import { BookShelfEmpty } from './BookShelfEmpty';
import classes from './BookShelf.module.scss';

const MainMenuButton = withMainMenuOverLay(ButtonPopover);
const DeskstopMainMenuButton = withDesktopHeaderBtn(MainMenuButton);

export function BookShelf() {
  const { list: books } = useBookShelfState();
  const { loginStatus } = useAuthState();

  return (
    <div className={classes['book-shelf']}>
      <ClientHeader
        title="書架"
        left={
          <DeskstopMainMenuButton
            minimal
            icon={MainMenuOverlayIcon}
            content={MainMenuOverlayTitle}
          />
        }
      />
      <div className={classes['book-shelf-content']}>
        <div className={classes['border']}></div>
        {books.length ? (
          books.map(data => <BookShelfItem key={data.bookID} data={data} />)
        ) : loginStatus === 'unknown' ? null : (
          <BookShelfEmpty />
        )}
      </div>
    </div>
  );
}
