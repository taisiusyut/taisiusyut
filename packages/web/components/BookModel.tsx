import React from 'react';
import Image from 'next/image';

interface Props {
  className?: string;
  width?: number;
  cover?: string | null;
}

const cover_1x1 = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAAAAAA6fptVAAAACklEQVR4nGM6AwAA0gDPuMu6oQAAAABJRU5ErkJggg==`;

export function BookModel({ cover, className = '', width = 60 }: Props) {
  const ratio = width / 60;
  const thickness = 10 * ratio;

  return (
    <div className="book-model-outer">
      <div className={`book-model ${className}`}>
        <div className="front">
          <Image
            layout="fixed"
            src={cover || cover_1x1}
            width={width}
            height={(width * 4) / 3}
            draggable={false}
          />
        </div>
        <div className="back" />
        <div className="right" />
        <div className="left" />
        <div className="top" />
        <div className="bottom" />
      </div>
      <style jsx>
        {`
          .book-model-outer {
            position: relative;
            perspective: 1000px;
            margin-right: 15px;
            left: -5px;

            width: ${width}px;
            min-width: ${width}px;
            height: ${(width * 4) / 3}px;

            user-select: none;
          }

          .book-model {
            width: 100%;
            height: 100%;
            position: absolute;
            transform-style: preserve-3d;
            transform: rotateY(30deg) rotateX(12deg);

            .front {
              transform: rotateY(0deg) translateZ(${thickness / 2}px);
            }
            .back {
              transform: rotateX(180deg) translateZ(${thickness / 2}px);
            }
            .right {
              transform: rotateY(90deg) translateZ(${30 * ratio}px);
            }
            .left {
              transform: rotateY(-90deg) translateZ(${30 * ratio}px);
            }
            .top {
              transform: rotateX(90deg)
                translateZ(${Math.floor(37.5 * ratio)}px);
            }
            .bottom {
              transform: rotateX(-90deg)
                translateZ(${Math.floor(37.5 * ratio)}px);
            }

            .left,
            .right {
              width: ${thickness}px;
            }

            .top,
            .bottom {
              height: ${thickness}px;
            }

            .front,
            .bottom {
              background-color: var(--book-model-front-bottom-color);
            }

            .back {
              box-shadow: 0px -3px 10px -2px var(--book-model-shadow-color);
            }

            .left {
              background-color: var(--book-model-left-color);
              border: 1px solid var(--book-model-front-bottom-color);
              border-right: 0;
            }

            div {
              @include sq-dimen(100%);
              @include position(0, 0, 0, 0);

              margin: auto;

              background-size: cover;
              background-repeat: no-repeat;
              background-position: 0 0;
            }
          }
        `}
      </style>
    </div>
  );
}
