import React, { useEffect } from 'react';
import router from 'next/router';
import { useRxAsync } from 'use-rx-hooks';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Chapter } from '@/components/admin/Chapter';
import { UserRole } from '@/typings';
import { getChapter } from '@/service';
import { Toaster } from '@/utils/toaster';

const onFailure = Toaster.apiError.bind(Toaster, `Get chapter failure`);

export default function UpdateChapterPage() {
  const { bookID, chapterID } = router.query;

  if (typeof bookID !== 'string') {
    throw new Error(`bookID must be a string`);
  }

  if (typeof chapterID !== 'string') {
    throw new Error(`chapterID must be a string`);
  }

  const [{ data }, { fetch }] = useRxAsync(getChapter, {
    defer: true,
    onFailure
  });

  useEffect(() => {
    fetch({ bookID, chapterID });
  }, [fetch, bookID, chapterID]);

  return <Chapter bookID={bookID} chapterID={chapterID} chapter={data} />;
}

UpdateChapterPage.layout = AdminLayout;
UpdateChapterPage.access = [UserRole.Author];
UpdateChapterPage.redirect = '/admin';
