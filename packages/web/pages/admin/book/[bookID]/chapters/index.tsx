import React from 'react';
import router from 'next/router';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Chapter } from '@/components/admin/Chapter';
import { UserRole } from '@/typings';

export default function CreateChapterPage() {
  const { bookID } = router.query;

  if (typeof bookID !== 'string') {
    return null;
  }

  return <Chapter bookID={bookID} />;
}

CreateChapterPage.layout = AdminLayout;
CreateChapterPage.access = [UserRole.Author];
CreateChapterPage.redirect = '/admin';
