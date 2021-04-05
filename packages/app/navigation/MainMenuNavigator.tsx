import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { MainMenu } from '@/screens/MainMenu/MainMenu';
import { MainMenuParamList } from './routes';

const MainMenuStack = createStackNavigator<MainMenuParamList>();

export function MainMenuNavigator() {
  return (
    <MainMenuStack.Navigator>
      <MainMenuStack.Screen
        name="MainMenuScreen"
        component={MainMenu}
        options={{ headerTitle: '主選單' }}
      />
    </MainMenuStack.Navigator>
  );
}
