import React, { useMemo } from 'react';

export interface SkelectonProps {
  length: number;
  children?: React.ReactNode;
}

const color = '#ccc';

export const skelectonStyle: React.CSSProperties = {
  whiteSpace: 'break-spaces',
  userSelect: 'none',
  backgroundImage: `linear-gradient(0deg, ${color}, ${color})`,
  backgroundPosition: `center`,
  backgroundSize: `100% 80%`,
  backgroundRepeat: 'no-repeat'
};

export function Skelecton({ length, children }: SkelectonProps) {
  const content = useMemo(
    () => Array.from({ length }).reduce<string>(s => s + `\t`, ''),
    [length]
  );

  return children ? (
    <>{children}</>
  ) : (
    <span style={skelectonStyle}>{content}</span>
  );
}
