import React from 'react';
import { Pressable, View, Text, ViewStyle, StyleSheet } from 'react-native';
import { shadow } from '../utils/shadow';
import { lighten } from '../utils/color';

export interface ButtonStyles extends ViewStyle {
  fill?: boolean;
  color: string;
}

export interface ButtonProps extends Partial<ButtonStyles> {}

const common: ViewStyle = {
  alignItems: 'center',
  justifyContent: 'center',
  paddingHorizontal: 15,
  borderRadius: 5,
  height: 40,
  width: '100%'
};

const buttonStyles = ({ color }: ButtonStyles) => {
  const button: ViewStyle = {
    ...common,
    ...shadow(8, { shadowColor: color }),
    backgroundColor: color
  };
  const pressed: ViewStyle = {
    ...common,
    backgroundColor: lighten(color, 35)
  };
  return { button, pressed };
};

const styles = StyleSheet.create({
  ...buttonStyles({ color: '#111' }),
  text: {
    fontSize: 16,
    color: `#fff`
  }
});

export function Button() {
  return (
    <Pressable
      style={({ pressed }) => (pressed ? styles.pressed : styles.button)}
      onPress={() => void 0}
    >
      <View>
        <Text style={styles.text}>確認</Text>
      </View>
    </Pressable>
  );
}
