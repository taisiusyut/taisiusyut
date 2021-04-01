import React from 'react';
import {
  Pressable,
  Text,
  ViewStyle,
  TextStyle,
  PressableProps
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { shadow } from '../utils/shadow';
import { darken, gradientLighten, gradientDarken } from '../utils/color';

export interface ButtonStyles extends ViewStyle {
  fill?: boolean;
  borderColor: string;
  color: string;
  gradient: Gradient;
  shadowColor: string;
  text: TextStyle;
}

export interface Gradient {
  defaults: string[];
  pressed: string[];
}

export type ButtonIntent = 'primary' | 'danger' | 'none';

export interface ButtonProps extends PressableProps {
  intent?: ButtonIntent;
  text?: string;
}

const buttonStyles: ViewStyle = {
  borderRadius: 5,
  height: 40,
  width: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  borderWidth: 1
};

const colors: Record<ButtonIntent, string> = {
  none: `#f5f8fa`,
  primary: `#2974FA`,
  danger: `#cc0c0c`
};

const styles: Record<ButtonIntent, ButtonStyles> = {
  none: {
    color: colors.none,
    borderColor: darken(colors.none, 45),
    gradient: {
      defaults: gradientDarken(colors.none),
      pressed: gradientDarken(darken(colors.none, 30))
    },
    shadowColor: `#999`,
    text: {
      color: '#333'
    }
  },
  primary: {
    color: colors.primary,
    borderColor: colors.primary,
    gradient: {
      defaults: gradientLighten(colors.primary),
      pressed: gradientLighten(darken(colors.primary, 30))
    },
    shadowColor: colors.primary,
    text: {
      color: '#fff'
    }
  },
  danger: {
    color: colors.danger,
    borderColor: colors.danger,
    gradient: {
      defaults: gradientLighten(colors.danger),
      pressed: gradientLighten(darken(colors.danger, 30))
    },
    shadowColor: colors.danger,
    text: {
      color: '#fff'
    }
  }
};

export function Button({
  intent = 'none',
  text = 'Button',
  ...props
}: ButtonProps) {
  const { gradient, borderColor, shadowColor, text: _textStyle } = styles[
    intent
  ];

  const pressable: PressableProps['style'] = ({ pressed }) => ({
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    ...(pressed ? {} : shadow(8, { shadowColor }))
  });

  const gradientColors = (pressed?: boolean) =>
    pressed ? gradient.pressed : gradient.defaults;

  const gradientStyle: ViewStyle = {
    ...buttonStyles,
    borderColor: borderColor
  };

  const textStyle: TextStyle = { fontSize: 16, ..._textStyle };

  return (
    <Pressable {...props} style={pressable} onPress={() => void 0}>
      {({ pressed }) => (
        <LinearGradient colors={gradientColors(pressed)} style={gradientStyle}>
          <Text style={textStyle}>{text}</Text>
        </LinearGradient>
      )}
    </Pressable>
  );
}
