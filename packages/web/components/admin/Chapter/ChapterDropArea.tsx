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
    window.addEventListener('drop', dragEnd);
    window.addEventListener('dragover', dragOver);
    window.addEventListener('mouseout', dragEnd);
    return () => {
      window.removeEventListener('drop', dragEnd);
      window.removeEventListener('dragover', dragOver);
      window.removeEventListener('mouseout', dragEnd);
    };
  }, [dragOver, dragEnd]);

  return (
    <DropAreaOverlay
      className={classes['drop-area']}
      text="將文字檔案拖放到此處"
      usePortal={false}
      isOpen={showDropArea}
      onClose={dragEnd}
      onDrop={event => {
        dragEnd();
        onDrop(getFileFromEvent(event));
      }}
    />
  );
}
