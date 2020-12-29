type GAEvent = 'login' | 'sign_up' | 'search' | 'share';

interface GaEventProps {
  event?: GAEvent;
  method?: string;
  user_id?: string;

  search_type?: string;
  search_term?: string;

  content_type?: string;
  item_id?: string;
}

interface DataLayer<T> extends Array<T> {
  push(args: T): boolean | number;
}

declare interface Window {
  dataLayer: DataLayer<GaEventProps>;
}
