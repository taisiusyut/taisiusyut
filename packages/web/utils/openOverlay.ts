import React, { ComponentType, ReactNode } from 'react';
import ReactDOM from 'react-dom';
import { IOverlayProps } from '@blueprintjs/core';

interface OverlayProps extends IOverlayProps {
  children?: ReactNode;
}

export function createOpenOverlay<T extends Partial<OverlayProps>>(
  OverlayComponent: ComponentType<T>
) {
  return function openOverlay(
    config = {} as Omit<T, keyof OverlayProps> & Partial<OverlayProps>
  ) {
    const div = document.createElement('div');
    document.body.appendChild(div);

    let currentConfig: Omit<T, keyof OverlayProps> & Partial<OverlayProps> = {
      ...config,
      onClose: (...args) => {
        config?.onClose && config.onClose(...args);
        close();
      },
      onClosed: (...args) => {
        config?.onClosed && config.onClosed(...args);
        destroy();
      },
      isOpen: true
    };

    function destroy() {
      const unmountResult = ReactDOM.unmountComponentAtNode(div);
      if (unmountResult && div.parentNode) {
        div.parentNode.removeChild(div);
      }
    }

    function render({ children, ...props }: any) {
      ReactDOM.render(
        React.createElement(OverlayComponent, { ...props }, children),
        div
      );
    }

    function close() {
      currentConfig = {
        ...currentConfig,
        isOpen: false
      };
      render(currentConfig);
    }

    function update(newConfig: Partial<T>) {
      currentConfig = {
        ...currentConfig,
        ...newConfig
      };
      render(currentConfig);
    }

    render(currentConfig);

    return {
      destroy: close,
      update
    };
  };
}
