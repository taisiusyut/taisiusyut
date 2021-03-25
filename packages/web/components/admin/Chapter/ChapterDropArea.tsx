import { useRef, useEffect, DragEvent } from 'react';
import { Overlay, IOverlayProps, Icon } from '@blueprintjs/core';
import classes from './Chapter.module.scss';

interface ChapterDropAreaProps extends IOverlayProps {
  onClose: () => void;
  onDrop: (event: DragEvent) => void;
}

export function ChapterDropArea({
  onDrop,
  onClose,
  ...props
}: ChapterDropAreaProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (event: Event) => {
      event.preventDefault();

      if (event.type === 'drop' && event.target instanceof Node) {
        const valid =
          event.target === contentRef.current ||
          contentRef.current?.contains(event.target);
        if (valid) onDrop((event as unknown) as DragEvent);
        onClose();
      }
    };
    window.addEventListener('dragover', handler);
    window.addEventListener('drop', handler);
    return () => {
      window.removeEventListener('dragover', handler);
      window.removeEventListener('drop', handler);
    };
  }, [onDrop, onClose]);

  return (
    <Overlay
      {...props}
      className={classes['drop-area']}
      transitionDuration={0}
      onClose={onClose}
    >
      <div className={classes['drop-area-content']} ref={contentRef}>
        <Icon icon="upload" iconSize={40} />
        <div className={classes['drop-area-text']}>Drop the file here</div>
      </div>
    </Overlay>
  );
}
