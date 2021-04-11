import React, { CSSProperties } from 'react';
import Image from 'next/image';
import classes from './BookModel.module.scss';

interface Props {
  className?: string;
  modelClassName?: string;
  width?: number;
  cover?: string | null;
  name?: string;
  flatten?: boolean;
}

export function BookModel({
  cover,
  flatten,
  width = 60,
  className = '',
  modelClassName = ''
}: Props) {
  const ratio = width / 60;
  const thickness = 10 * ratio;
  const thicknessTB = Math.floor(37.5 * ratio);

  const outerStyle: CSSProperties = {
    width,
    minWidth: width,
    height: width * (4 / 3)
  };

  return (
    <div
      className={`${classes['book-model-outer']} ${className}`.trim()}
      style={outerStyle}
    >
      <div
        className={[
          modelClassName,
          classes['book-model'],
          flatten ? classes['flatten'] : ''
        ]
          .join(' ')
          .trim()}
      >
        <div
          className={classes['front']}
          style={{ transform: `rotateY(0deg) translateZ(${thickness / 2}px)` }}
        >
          {cover ? (
            <Image
              layout="fixed"
              alt="book cover"
              src={cover}
              width={width}
              height={(width * 4) / 3}
              draggable={false}
            />
          ) : null}
        </div>
        <div
          className={classes['back']}
          style={{
            transform: `rotateY(180deg) translateZ(${thickness / 2}px)`
          }}
        />
        <div
          className={classes['right']}
          style={{
            width: thickness,
            transform: `rotateY(90deg) translateZ(${30 * ratio}px)`
          }}
        />
        <div
          className={classes['left']}
          style={{
            width: thickness,
            transform: `rotateY(-90deg) translateZ(${30 * ratio}px)`
          }}
        />
        <div
          className={classes['top']}
          style={{
            height: thickness,
            transform: `rotateX(90deg) translateZ(${thicknessTB}px)`
          }}
        />
        <div
          className={classes['bottom']}
          style={{
            height: thickness,
            transform: `rotateX(-90deg) translateZ(${thicknessTB}px)`
          }}
        />
      </div>
    </div>
  );
}
