import React, { useEffect, useState } from 'react';
import { IResizeEntry, ResizeSensor } from '@blueprintjs/core';

type BreakPoint = typeof breakPoints[number];

interface WithBreakPointOps {
  validate: (breakPoint: BreakPoint) => boolean;
  fallback?: React.ReactElement | null;
}

const breakPoints = [480, 640, 768, 1280] as const;

const Context = React.createContext<BreakPoint | undefined>(undefined);

function getBreakPoint(width: number): BreakPoint {
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

export function withBreakPoint<P extends {}>(
  Component: React.ComponentType<P>,
  { validate, fallback = null }: WithBreakPointOps
) {
  return function WithBreakPoint(props: P) {
    const [breakPoint, mounted] = useBreakPoints();
    if (mounted && validate(breakPoint)) {
      return React.createElement<P>(Component, props);
    }
    return fallback;
  };
}

export function BreakPointsProvider({
  children
}: {
  children: React.ReactElement;
}) {
  const [breakPoint, setBreakPoint] = useState<BreakPoint>(
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
