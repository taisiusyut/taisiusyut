import React, { ReactElement, useEffect, useState } from 'react';
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
  return 1280;
}

export function useBreakPoints() {
  const context = React.useContext(Context);
  const [mounted, setMounted] = useState(false);
  if (context === undefined) {
    throw new Error('useBreakPoints must be used within a BreakPointsProvider');
  }
  useEffect(() => {
    setMounted(true);
  }, [setMounted]);
  return [context, mounted] as const;
}

export function BreakPointsProvider({ children }: { children: ReactElement }) {
  const [breakPoint, setBreakPoint] = useState<Point>(
    typeof window !== 'undefined' ? getBreakPoint(window.innerWidth) : 1280
  );
  const [onResize] = useState(() => ([entry]: IResizeEntry[]) => {
    setBreakPoint(getBreakPoint(entry.target.clientWidth));
  });

  return React.createElement(
    Context.Provider,
    { value: breakPoint },
    React.createElement(ResizeSensor, { onResize }, children)
  );
}
