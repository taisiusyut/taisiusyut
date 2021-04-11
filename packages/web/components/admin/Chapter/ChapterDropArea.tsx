import { useEffect } from 'react';
import { DropAreaOverlay } from '@/components/DropArea';
import { useBoolean } from '@/hooks/useBoolean';
import { getFileFromEvent } from '@/hooks/useFileUpload';
import classes from './Chapter.module.scss';

interface ChapterDropAreaProps {
  onDrop: (file: File) => void;
}

export function ChapterDropArea({ onDrop }: ChapterDropAreaProps) {
  const [showDropArea, dragOver, dragEnd] = useBoolean();

  useEffect(() => {
    document.body.addEventListener('dragover', dragOver);
    window.addEventListener('drop', dragEnd);
    window.addEventListener('mouseout', dragEnd);
    return () => {
      document.body.removeEventListener('dragover', dragOver);
      window.removeEventListener('drop', dragEnd);
      window.removeEventListener('mouseout', dragEnd);
    };
  }, [dragOver, dragEnd]);

  return (
    <DropAreaOverlay
      active
      usePortal={false}
      text="將文字檔案拖放到此處"
      className={classes['drop-area']}
      isOpen={showDropArea}
      onClose={dragEnd}
      onDrop={event => {
        dragEnd();
        onDrop(getFileFromEvent(event));
      }}
    />
  );
}
