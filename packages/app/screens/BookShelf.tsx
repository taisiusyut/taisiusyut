import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useAuthState } from '@/hooks/useAuth';
import { Text } from '@/components/Text';
import { Button } from '@/components/Button';
import { withAuthRequired } from '@/components/withAuthRequired';

const LoginButton = withAuthRequired(Button);

export function BookShelf() {
  const { loginStatus } = useAuthState();

  if (loginStatus === 'unknown' || loginStatus === 'loading') {
    return null;
  }

  if (loginStatus === 'required') {
    return (
      <View style={styles.centerView}>
        <Text style={styles.loginText}>請先登入</Text>
        <LoginButton intent="primary" width={100}>
          登入
        </LoginButton>
      </View>
    );
  }

  return (
    <View style={styles.centerView}>
      <Text>BookShelf</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  centerView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  loginText: {
    marginBottom: 15
  }
});
