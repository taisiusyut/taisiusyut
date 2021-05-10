import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRxAsync } from 'use-rx-hooks';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/core';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/Button';
import { createUserForm, UserFormProps } from '@/components/UserForm';
import { AuthParamList } from '@/navigation/routes';
import { useAuthActions } from '@/hooks/useAuth';

export interface AuthScreenProps extends UserFormProps {
  nextScreen: keyof AuthParamList;
}

const { Form } = createUserForm();

export function AuthScreen({
  children,
  nextScreen,
  form,
  ...props
}: AuthScreenProps) {
  if (!form) throw new Error('form not found');

  const { authenticate } = useAuthActions();
  const [handleSumbit] = useState(() => async () => {
    const payload = await form.validateFields();
    await authenticate(payload).toPromise();
  });
  const navigation = useNavigation();
  function onCancel() {
    navigation.reset({
      index: 0,
      routes: [{ name: nextScreen }]
    });
  }

  const [{ loading }, { fetch }] = useRxAsync(handleSumbit);

  useEffect(() => {
    form.resetFields();
  }, [form]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAwareScrollView
        bounces={false}
        extraScrollHeight={-30}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
        <Form
          {...props}
          form={form}
          style={styles.container}
          keyboardViewProps={false}
        >
          <View>
            <Logo />
            {children}
          </View>
          <View style={styles.footer}>
            <Button intent="primary" onPress={fetch} loading={loading}>
              登入
            </Button>
            <Button onPress={onCancel} style={styles.button}>
              {nextScreen === 'LoginScreen' ? '已有帳號' : '註冊'}
            </Button>
          </View>
        </Form>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  scrollView: { alignSelf: 'stretch' },
  scrollViewContent: {
    flexGrow: 1
  },
  safeArea: {
    flex: 1
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 15
  },
  footer: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  button: {
    marginTop: 10
  }
});
