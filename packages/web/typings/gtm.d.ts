interface View {
  content_type: string;
  item_id: string;
}

interface Auth {
  method: string;
  user_id: string;
}

interface ShareBook extends View {
  event: 'share';
}
interface ViewBook extends View {
  event: 'view_book';
}

interface SearchBook extends View {
  event: 'search';
}
interface Login extends Auth {
  event: 'login';
}
interface SignUp extends Auth {
  event: 'sign_up';
}

type GA4Event = ShareBook | ViewBook | SearchBook | Login | SignUp;
type GTMTag = GA4Event;

interface DataLayer<T> extends Array<T> {
  push(args: T): boolean | number;
}

declare interface Window {
  dataLayer: DataLayer<GTMTag | Partial<GTMTag>>;
}
