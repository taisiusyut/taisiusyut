import { useEffect, HTMLAttributes, DragEventHandler } from 'react';
import { Icon, IOverlayProps, Overlay } from '@blueprintjs/core';
import classes from './DropArea.module.scss';

interface BasicDropAreaProps {
  text?: string;
  active?: boolean;
  disabled?: boolean;
}

export interface DropAreaProps
  extends BasicDropAreaProps,
    HTMLAttributes<HTMLDivElement> {}

export interface DropAreaOverlayProps
  extends IOverlayProps,
    BasicDropAreaProps {
  onDrop: DragEventHandler;
}

export function DropArea({
  text,
  onDrop,
  active,
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
    disabled ? classes['disabled'] : active ? classes['active'] : ''
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
  active,
  disabled,
  onDrop,
  ...props
}: DropAreaOverlayProps) {
  return (
    <Overlay {...props} transitionDuration={0}>
      <DropArea
        text={text}
        active={active}
        disabled={disabled}
        onDrop={onDrop}
      />
    </Overlay>
  );
}
