import React, { ReactElement, useState } from 'react';
import { IResizeEntry, ResizeSensor } from '@blueprintjs/core';

type Point = typeof breakPoints[number];

const breakPoints = [480, 640, 768, 1280] as const;

const Context = React.createContext<Point | undefined>(undefined);

function getBreakPoint(width: number): Point {
  for (const breakPoint of breakPoints) {
    if (width <= breakPoint) {
      return breakPoint;
    }
  }
  return breakPoints.slice(-1)[0];
}

export function useBreakPoints() {
  return React.useContext(Context);
}

export function BreakPointsProvider({ children }: { children: ReactElement }) {
  const [breakPoint, setBreakPoint] = useState<Point>();
  const [onResize] = useState(() => ([entry]: IResizeEntry[]) => {
    setBreakPoint(getBreakPoint(entry.target.clientWidth));
  });

  return React.createElement(
    Context.Provider,
    { value: breakPoint },
    React.createElement(ResizeSensor, { onResize }, children)
  );
}
