import { Card, ICardProps } from '@blueprintjs/core';
import { Logo } from '@/components/Logo';
import classes from './CardWithLogo.module.scss';

export function CardWithLogo({
  title,
  children,
  elevation = 2,
  ...props
}: ICardProps) {
  return (
    <div className={classes['card']}>
      <Card {...props} elevation={elevation}>
        <div className={classes['header']}>
          <Logo imageSize={110} />
        </div>
        <div>{children}</div>
      </Card>
    </div>
  );
}
