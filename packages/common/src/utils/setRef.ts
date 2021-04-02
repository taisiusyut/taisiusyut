import type { ForwardedRef } from 'react';

export const setRef = <T extends {}>(...refs: ForwardedRef<T>[]) => (
  ref: T
) => {
  for (const refObj of refs) {
    if (typeof refObj === 'function') {
      return refObj(ref);
    } else if (refObj) {
      refObj.current = ref;
    }
  }
};
