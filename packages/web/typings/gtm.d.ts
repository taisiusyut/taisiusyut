type GAEvent = 'login' | 'sign_up';

interface GaEventProps {
  event?: GAEvent;
  method?: string;
  user_id?: string;
}

interface DataLayer<T> extends Array<T> {
  push(args: T): boolean | number;
}

declare interface Window {
  dataLayer: DataLayer<GaEventProps>;
}
