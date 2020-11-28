import React, { useEffect } from 'react';
import router from 'next/router';
import { useRxAsync } from 'use-rx-hooks';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Chapter } from '@/components/admin/Chapter';
import { UserRole } from '@/typings';
import { getChapter } from '@/service';
import { Toaster } from '@/utils/toaster';

interface Params {
  bookID: string;
  chapterID: string;
}

const onFailure = Toaster.apiError.bind(Toaster, `Get chapter failure`);

function UpdateChapterPageContent({ bookID, chapterID }: Params) {
  const [{ data }, { fetch }] = useRxAsync(getChapter, {
    defer: true,
    onFailure
  });

  useEffect(() => {
    fetch({ bookID, chapterID });
  }, [fetch, bookID, chapterID]);

  return <Chapter bookID={bookID} chapterID={chapterID} chapter={data} />;
}

export default function UpdateChapterPage() {
  const { bookID, chapterID } = router.query;

  if (typeof bookID !== 'string' || typeof chapterID !== 'string') {
    return null;
  }

  return <UpdateChapterPageContent bookID={bookID} chapterID={chapterID} />;
}

UpdateChapterPage.layout = AdminLayout;
UpdateChapterPage.access = [UserRole.Author];
UpdateChapterPage.redirect = '/admin';
