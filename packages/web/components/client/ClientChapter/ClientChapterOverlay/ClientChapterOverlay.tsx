import React from 'react';
import { Icon, IIconProps, IOverlayProps, Overlay } from '@blueprintjs/core';
import { GoBackButton } from '@/components/GoBackButton';
import { withBreakPoint } from '@/hooks/useBreakPoints';
import { createOpenOverlay } from '@/utils/openOverlay';
import classes from './ClientChapterOverlay.module.scss';

interface Props extends IOverlayProps {
  bookName?: string;
}

type DivProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

interface ItemProps extends DivProps {
  icon?: IIconProps['icon'];
  isActive?: boolean;
}

function Item({ icon, children, isActive, ...props }: ItemProps) {
  return (
    <div
      {...props}
      className={[classes['item'], isActive ? classes['active'] : '']
        .join(' ')
        .trim()}
    >
      <Icon icon={icon} />
      <div className={classes['text']}>{children}</div>
    </div>
  );
}

function ClientChapterOverlayBase({ bookName = '', ...props }: Props) {
  return (
    <Overlay {...props}>
      <div className={classes['content']} onClick={props.onClose}>
        <div className={classes['top']}>
          <GoBackButton targetPath={['/', `/book/${bookName}`, '/featured']} />
        </div>
        <div className={classes['bottom']}>
          <div className={classes['bottom-head']}>
            <div>上一章</div>
            <div>下一章</div>
          </div>
          <div className={classes['bottom-content']}>
            <Item icon="home">書架</Item>
            <Item icon="book">詳情</Item>
            <Item icon="settings">設定</Item>
            <Item icon="properties">目錄</Item>
          </div>
        </div>
      </div>
    </Overlay>
  );
}

export const ClientChapterOverlay = withBreakPoint(ClientChapterOverlayBase, {
  validate: breakPoint => breakPoint <= 768
});

export const openClientChapterOverlay = createOpenOverlay(ClientChapterOverlay);
