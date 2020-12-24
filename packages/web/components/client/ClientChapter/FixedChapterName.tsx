import React from 'react';
import { withBreakPoint } from '@/hooks/useBreakPoints';
import classes from './ClientChapter.module.scss';

interface Props {
  title: string;
}

export function ChapterName({ title }: Props) {
  return <div className={classes['fixed-chapter-name']}>{title}</div>;
}

export const FixedChapterName = withBreakPoint(ChapterName, {
  validate: breakPoint => breakPoint <= 768
});
