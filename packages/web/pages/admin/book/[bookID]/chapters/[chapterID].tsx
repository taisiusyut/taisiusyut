import React, { useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { useRxAsync } from 'use-rx-hooks';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Chapter } from '@/components/admin/Chapter';
import { UserRole } from '@/typings';
import { getChapter } from '@/service';
import { Toaster } from '@/utils/toaster';

interface Props {
  bookID: string;
  chapterID: string;
}

const onFailure = Toaster.apiError.bind(Toaster, `Get chapter failure`);

export default function UpdateChapterPage({ bookID, chapterID }: Props) {
  const [{ data }, { fetch }] = useRxAsync(getChapter, {
    defer: true,
    onFailure
  });

  useEffect(() => {
    fetch({ bookID, chapterID });
  }, [fetch, bookID, chapterID]);

  return <Chapter bookID={bookID} chapterID={chapterID} chapter={data} />;
}

export const getServerSideProps: GetServerSideProps<Props> = async context => {
  const { bookID, chapterID } = context.query;

  if (typeof bookID !== 'string') {
    throw new Error(`BookID must be a string`);
  }

  if (typeof chapterID !== 'string') {
    throw new Error(`chapterID must be a string`);
  }

  return {
    props: {
      bookID,
      chapterID
    }
  };
};

UpdateChapterPage.layout = AdminLayout;
UpdateChapterPage.access = [UserRole.Author];
UpdateChapterPage.redirect = '/admin';
