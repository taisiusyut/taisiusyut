import Image from 'next/image';
import { Card, H5, ICardProps } from '@blueprintjs/core';

const imageSize = 130;

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
          <div className="logo">
            <Image src="/logo.png" width={imageSize} height={imageSize} />
          </div>
          <H5 children={title} />
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

          .logo {
            @include margin-y(-10px -25px);
            filter: drop-shadow(2px 4px 6px #ccc);
          }
        `}
      </style>
    </div>
  );
}
