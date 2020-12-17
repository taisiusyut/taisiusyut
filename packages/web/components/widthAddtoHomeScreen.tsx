import React, { useEffect, useState } from 'react';
import { fromEvent } from 'rxjs';

interface OnClick {
  onClick?: (event: React.MouseEvent<any>) => void;
}

interface ChoiseResult {
  outcome: string;
}

interface PromptEvent extends Event {
  prompt(): void;
  userChoise: () => Promise<ChoiseResult>;
}

export function widthAddtoHomeScreen<P extends OnClick>(
  Component: React.ComponentType<P>
) {
  return function WidthAddtoHomeScreen(props: P) {
    const [deferredPrompt, setDeferredPrompt] = useState<PromptEvent | null>(
      null
    );

    async function handleClick() {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const result = await deferredPrompt.userChoise();
        if (result.outcome === 'accepted') {
          setDeferredPrompt(null);
        }
      }
    }

    useEffect(() => {
      const subscription = fromEvent<PromptEvent>(
        window,
        'beforeinstallprompt'
      ).subscribe(event => {
        event.preventDefault();
        setDeferredPrompt(event);
      });
      return subscription.unsubscribe();
    }, []);

    return deferredPrompt && <Component {...props} onClick={handleClick} />;
  };
}
