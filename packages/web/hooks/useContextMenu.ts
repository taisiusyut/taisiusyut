import { MouseEvent, TouchEvent, useRef, useEffect } from 'react';
import { EMPTY, fromEvent, merge, of } from 'rxjs';
import { delay, expand, switchMap, takeUntil, tap } from 'rxjs/operators';

export function useContextMenu<T extends HTMLElement>(
  callback: (event: MouseEvent<T> | TouchEvent<T>) => void
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (el) {
      // for iPhone safari
      const longPress$ = fromEvent<TouchEvent<T>>(el, 'touchstart').pipe(
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
                fromEvent<TouchEvent<T>>(el, 'touchmove'),
                fromEvent<TouchEvent<T>>(el, 'touchend'),
                fromEvent<TouchEvent<T>>(el, 'touchcancel')
              )
            )
          );
        })
      );

      const contextmenu$ = fromEvent<MouseEvent<T>>(el, 'contextmenu');

      const subscription = merge(contextmenu$, longPress$)
        .pipe(
          tap(event => {
            event.preventDefault();
          })
        )
        .subscribe(event => {
          event.preventDefault();
          callback(event);
          el.blur();
        });

      return () => subscription.unsubscribe();
    }
  }, [callback]);

  return [ref];
}
