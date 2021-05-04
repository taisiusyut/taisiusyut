import React from 'react';
import { PressableProps } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { useNavigation } from '@react-navigation/core';

export interface OnPress extends Pick<PressableProps, 'onPress'> {}

export function withAuthRequired<P extends OnPress>(
  Component: React.ComponentType<P>
) {
  return function OpenLoginDialog(props: P) {
    const [{ loginStatus }] = useAuth();
    const { navigate } = useNavigation();

    function handleLogin() {
      navigate('Auth');
    }

    return (
      <Component
        {...((props as unknown) as P)}
        onPress={loginStatus === 'loggedIn' ? props.onPress : handleLogin}
      />
    );
  };
}
