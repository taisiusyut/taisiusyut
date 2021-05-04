import React, { useRef } from 'react';
import { TextInput } from 'react-native';
import { TextInputProps } from '@/components/Textinput';

export function useFocusNext<T extends string>() {
  const { current: controlRefs } = useRef<{ [X in T]?: TextInput | null }>({});
  return {
    controlRefs,
    refProps: (name: T): React.ForwardedRef<TextInput> => input => {
      controlRefs[name] = input;
    },
    focusNextProps: (key: T): TextInputProps => ({
      returnKeyType: 'next',
      onSubmitEditing: () => controlRefs[key]?.focus()
    })
  };
}
