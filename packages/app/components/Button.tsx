import React from 'react';
import {
  Pressable,
  Text,
  ViewStyle,
  TextStyle,
  PressableProps,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { shadow } from '@/utils/shadow';
import { colors, darken, gradientLighten, gradientDarken } from '@/utils/color';

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
  loading?: boolean;
}

const defaultColor = `#f5f8fa`;

const styles: Record<ButtonIntent, ButtonStyles> = {
  none: {
    color: defaultColor,
    borderColor: darken(defaultColor, 45),
    gradient: {
      defaults: gradientDarken(defaultColor),
      pressed: gradientDarken(darken(defaultColor, 30))
    },
    shadowColor: `#999`,
    text: {
      color: '#333'
    }
  },
  primary: {
    color: colors.blue,
    borderColor: colors.blue,
    gradient: {
      defaults: gradientLighten(colors.blue),
      pressed: gradientLighten(darken(colors.blue, 30))
    },
    shadowColor: colors.blue,
    text: {
      color: '#fff'
    }
  },
  danger: {
    color: colors.red,
    borderColor: colors.red,
    gradient: {
      defaults: gradientLighten(colors.red),
      pressed: gradientLighten(darken(colors.red, 30))
    },
    shadowColor: colors.red,
    text: {
      color: '#fff'
    }
  }
};

export function Button({
  intent = 'none',
  children,
  loading,
  disabled,
  style,
  ...props
}: ButtonProps) {
  const { gradient, borderColor, shadowColor, text: _textStyle } = styles[
    intent
  ];

  const isDisabled = disabled || loading;

  const pressable: PressableProps['style'] = props => {
    return StyleSheet.compose(
      {
        alignSelf: 'stretch',
        ...(isDisabled ? { opacity: 0.5 } : {}),
        ...(props.pressed || isDisabled ? {} : shadow(8, { shadowColor }))
      },
      typeof style === 'function' ? style(props) : style
    );
  };

  const gradientColors = (pressed?: boolean) =>
    pressed ? gradient.pressed : gradient.defaults;

  const buttonStyles: ViewStyle = {
    borderWidth: 1,
    borderRadius: 5,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center'
  };

  const gradientStyle: ViewStyle = {
    ...buttonStyles,
    borderColor: borderColor
  };

  const textStyle: TextStyle = { fontSize: 16, ..._textStyle };

  return (
    <Pressable {...props} style={pressable} disabled={isDisabled}>
      {({ pressed }) => (
        <LinearGradient colors={gradientColors(pressed)} style={gradientStyle}>
          {loading ? (
            <ActivityIndicator color={textStyle.color} />
          ) : (
            <Text style={textStyle}>{children}</Text>
          )}
        </LinearGradient>
      )}
    </Pressable>
  );
}
