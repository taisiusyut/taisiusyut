import { useEffect, HTMLAttributes } from 'react';
import { Icon, IOverlayProps, Overlay } from '@blueprintjs/core';
import classes from './DropArea.module.scss';

export interface DropAreaProps extends HTMLAttributes<HTMLDivElement> {
  text?: string;
  disabled?: boolean;
}

export interface DropAreaOverlayProps
  extends IOverlayProps,
    Pick<DropAreaProps, 'text' | 'onDrop'> {}

export function DropArea({
  text,
  onDrop,
  disabled,
  onClick,
  className = '',
  ...props
}: DropAreaProps) {
  useEffect(() => {
    const handler = (event: Event) => {
      event.preventDefault();
    };
    window.addEventListener('dragover', handler);
    window.addEventListener('drop', handler);
    return () => {
      window.removeEventListener('dragover', handler);
      window.removeEventListener('drop', handler);
    };
  }, []);

  const classNames = [
    className,
    classes['drop-area'],
    disabled ? classes['disabled'] : ''
  ];

  return (
    <div
      {...props}
      onClick={disabled ? undefined : onClick}
      onDrop={disabled ? undefined : onDrop}
      className={classNames.join(' ').trim()}
    >
      <Icon icon="upload" />
      <div className={classes['drop-area-text']}>{text}</div>
    </div>
  );
}

export function DropAreaOverlay({
  text,
  onDrop,
  ...props
}: DropAreaOverlayProps) {
  return (
    <Overlay {...props} transitionDuration={0}>
      <DropArea text={text} onDrop={onDrop} />
    </Overlay>
  );
}
