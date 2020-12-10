import { Card, ICardProps } from '@blueprintjs/core';
import { Logo } from '@/components/Logo';

export function CardWithLogo({
  title,
  children,
  elevation = 2,
  ...props
}: ICardProps) {
  return (
    <div className="card">
      <Card {...props} elevation={elevation}>
        <div className="header">
          <Logo imageSize={130} />
        </div>
        <div>{children}</div>
      </Card>
      <style jsx>
        {`
          .card {
            width: 100%;
            max-width: 380px;
            margin-bottom: 50px;

            :global(button + button) {
              margin-top: 15px;
            }
          }

          .header {
            text-align: center;
            margin-bottom: 30px;

            :global(h5) {
              white-space: break-spaces;
            }
          }
        `}
      </style>
    </div>
  );
}
