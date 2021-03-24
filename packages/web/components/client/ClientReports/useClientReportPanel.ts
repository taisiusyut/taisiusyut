import { useEffect, useRef } from 'react';
import { AxiosError } from 'axios';
import { EMPTY, fromEvent, merge } from 'rxjs';
import {
  catchError,
  distinctUntilChanged,
  startWith,
  map,
  concatMap
} from 'rxjs/operators';
import { getBugReports } from '@/service';
import { Toaster } from '@/utils/toaster';
import { useClientReports } from './useClientReports';

export function useClientReportPanel() {
  const [state, actions] = useClientReports();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const pageSize = state.pageSize;

  useEffect(() => {
    const scroller = scrollerRef.current;

    if (!scroller) {
      throw new Error(`scroller is not defined`);
    }

    const scroller$ = fromEvent(scroller, 'scroll').pipe(
      map(
        () =>
          [
            scroller.scrollTop,
            scroller.offsetHeight + scroller.offsetTop
          ] as const
      )
    );

    const windowScroll$ = fromEvent(window, 'scroll').pipe(
      map(() => [window.scrollY, window.innerHeight] as const)
    );

    let pageNo = 1;

    const subscription = merge(scroller$, windowScroll$)
      .pipe(
        startWith([0, 0]),
        map(([scrollTop, offsetHeight]) => {
          if (scrollTop === 0) {
            pageNo = 1;
          }
          const nextIndex = pageNo * pageSize;
          const elements: Element[] = Array.prototype.slice.call(
            scroller.children,
            nextIndex
          );
          const target = elements.find(
            (e): e is HTMLElement => e instanceof HTMLElement
          );
          if (target && scrollTop + offsetHeight >= target.offsetTop) {
            pageNo += 1;
          }
          return pageNo;
        }),
        distinctUntilChanged(),
        concatMap(pageNo => getBugReports({ pageNo, pageSize })),
        catchError((error: AxiosError) => {
          if (error.config.params?.pageNo === 1) {
            actions.list([]);
          }
          Toaster.apiError(`Get books failure`, error);
          return EMPTY;
        })
      )
      .subscribe(payload => {
        if (payload.pageNo === 1) {
          actions.reset();
        }
        actions.paginate(payload);
      });

    return () => subscription.unsubscribe();
  }, [actions, pageSize]);

  return { state, actions, scrollerRef };
}
