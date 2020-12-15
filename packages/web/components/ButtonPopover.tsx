import React, { useEffect, useState } from 'react';
import {
  Button,
  Popover,
  IButtonProps,
  IPopoverProps
} from '@blueprintjs/core';
import { isTouchable } from '@/constants';

export interface ButtonPopoverProps
  extends IButtonProps,
    Pick<IPopoverProps, 'position' | 'content'> {
  popoverProps?: IPopoverProps;
}

export const ButtonPopover = React.forwardRef<any, ButtonPopoverProps>(
  ({ popoverProps, content, position, disabled, ...props }, ref) => {
    const [disablePopover, setDisablePopover] = useState(false);
    const button = <Button ref={ref} disabled={disabled} {...props} />;

    useEffect(() => {
      setDisablePopover(isTouchable);
    }, []);

    return (
      <>
        {content && !disablePopover ? (
          <Popover
            popoverClassName={'button-popover'}
            interactionKind="hover-target"
            hoverOpenDelay={0}
            hoverCloseDelay={0}
            content={content}
            position={position}
            disabled={disabled}
            {...popoverProps}
          >
            {button}
          </Popover>
        ) : (
          button
        )}
        <style jsx global>
          {`
            .button-popover {
              .#{$ns}-popover-content {
                padding: $pt-grid-size/2 $pt-grid-size;
                white-space: nowrap;
              }
            }
          `}
        </style>
      </>
    );
  }
);
