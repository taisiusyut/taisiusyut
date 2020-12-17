import { MouseEvent, TouchEvent, useRef, useEffect } from 'react';
import { EMPTY, fromEvent, merge, of } from 'rxjs';
import { delay, expand, switchMap, takeUntil, tap } from 'rxjs/operators';

export type UseContextMenuEvent<T extends HTMLElement> =
  | MouseEvent<T>
  | TouchEvent<T>;

export function useContextMenu<T extends HTMLElement>(
  callback: (event: UseContextMenuEvent<T>) => void
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (el) {
      const opts = { passive: true };

      // for iPhone safari
      const longPress$ = fromEvent<TouchEvent<T>>(el, 'touchstart', opts).pipe(
        switchMap(event => {
          return of(event).pipe(
            delay(400),
            expand(() => {
              // for debug tools
              return fromEvent<MouseEvent<T>>(window, 'contextmenu').pipe(
                switchMap(event => {
                  event.preventDefault();
                  return EMPTY;
                })
              );
            }),
            takeUntil(
              merge(
                fromEvent<TouchEvent<T>>(el, 'touchmove', opts),
                fromEvent<TouchEvent<T>>(el, 'touchend', opts),
                fromEvent<TouchEvent<T>>(el, 'touchcancel', opts)
              )
            )
          );
        })
      );

      const contextmenu$ = fromEvent<MouseEvent<T>>(el, 'contextmenu').pipe(
        tap(event => {
          event.preventDefault();
        })
      );

      const subscription = merge(contextmenu$, longPress$).subscribe(callback);

      return () => subscription.unsubscribe();
    }
  }, [callback]);

  return [ref];
}
