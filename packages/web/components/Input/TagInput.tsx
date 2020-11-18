import React from 'react';
import { TagInput as Bp3TagInput, ITagInputProps } from '@blueprintjs/core';

export interface TagInputProps extends Partial<ITagInputProps> {}

export function TagInput(props?: TagInputProps) {
  return (
    <Bp3TagInput
      fill
      {...props}
      {...(props && props.onChange && Array.isArray(props.values)
        ? { values: props.values }
        : { values: [] })}
    />
  );
}
