import React from 'react';
import Image from 'next/image';
import { H5 } from '@blueprintjs/core';

interface Props {
  imageSize?: number;
}

export function Logo({ imageSize = 100 }: Props) {
  return (
    <div
      style={{
        textAlign: 'center',
        marginTop: -imageSize * 0.1,
        marginBottom: imageSize * 0.3,
        filter: `drop-shadow(var(--logo-shadow))`
      }}
    >
      <Image
        src="/logo.png"
        alt="logo"
        width={imageSize}
        height={imageSize}
        priority
        unoptimized
      />
      <H5
        style={{
          marginTop: -imageSize * 0.225,
          fontSize: (14 * imageSize) / 100
        }}
      >
        睇小說
      </H5>
    </div>
  );
}
