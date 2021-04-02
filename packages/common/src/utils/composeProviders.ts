import React from 'react';

export interface ProviderProps {
  children: React.ReactElement;
}

export function composeProviders(
  ..._components: React.ComponentType<ProviderProps>[]
) {
  const components = _components.slice().reverse();
  return ({ children }: ProviderProps) => {
    return components.reduce(
      (node, Provider) => React.createElement(Provider, undefined, node),
      children
    );
  };
}
