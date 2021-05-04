import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Login } from '@/screens/Auth/Login';
import { Registration } from '@/screens/Auth/Registration';
import { AuthParamList } from './routes';

const AuthStack = createStackNavigator<AuthParamList>();

export function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerBackTitleVisible: false }}>
      <AuthStack.Screen
        name="LoginScreen"
        component={Login}
        options={{ headerTitle: '會員登入' }}
      />
      <AuthStack.Screen
        name="RegistrationScreen"
        component={Registration}
        options={{ headerTitle: '會員註冊' }}
      />
    </AuthStack.Navigator>
  );
}
