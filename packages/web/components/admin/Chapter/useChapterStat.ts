import { useCallback, useEffect, useRef, useState } from 'react';
import { Subject, fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { calcWordCount } from '@taisiusyut/server/dist/utils/caclWordCount';
import { Schema$Chapter, ChapterType } from '@/typings';
import { createChapterSotrage } from '@/utils/storage';
import { Toaster } from '@/utils/toaster';
import { ChapterState } from './ChapterForm';

export interface ChapterStatProps {
  bookID: string;
  chapterID?: string;
  chapter?: Schema$Chapter;
}

export const change$ = new Subject<Partial<ChapterState>>();

export function useChapterStat({
  bookID,
  chapterID,
  chapter
}: ChapterStatProps) {
  const storageRef = useRef(
    createChapterSotrage<Partial<ChapterState> | null>(
      chapterID || bookID,
      null
    )
  );

  const [saved, setSaved] = useState<Partial<ChapterState> | null>();
  const [wordCount, setWordCount] = useState<number | null>(null);
  const onChange = useCallback((state: Partial<ChapterState>) => {
    setSaved(null);
    setWordCount(null);
    change$.next(state);
  }, []);

  // initialize
  useEffect(() => {
    const state: Partial<ChapterState> = {
      type: ChapterType.Free,
      ...chapter,
      ...storageRef.current.get()
    };
    setSaved(state);
    setWordCount(state.content ? calcWordCount(state.content) : 0);
  }, [chapter]);

  // handle onchange
  useEffect(() => {
    const storage = storageRef.current;
    const subscription = change$.pipe(debounceTime(2000)).subscribe(chapter => {
      try {
        storage.save(chapter);
        setSaved(chapter);
        setWordCount(calcWordCount(chapter.content || ''));
      } catch (error) {
        Toaster.apiError(error, `Save content failure`);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!saved && process.env.NODE_ENV === 'production') {
      const subscription = fromEvent<BeforeUnloadEvent>(
        window,
        'beforeunload'
      ).subscribe(event => {
        event.preventDefault();
        event.returnValue = 'Changes you made may not be saved.';
      });
      return () => subscription.unsubscribe();
    }
  }, [saved]);

  return {
    saved,
    wordCount,
    onChange,
    storage: storageRef.current
  };
}
