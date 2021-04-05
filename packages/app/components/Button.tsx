import React from 'react';
import {
  Pressable,
  Text,
  ViewStyle,
  TextStyle,
  PressableProps,
  StyleSheet,
  ActivityIndicator,
  View
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { shadow } from '@/utils/shadow';
import { useColorScheme } from '@/hooks/useColorScheme';
import { colors, darken, gradientLighten, gradientDarken } from '@/utils/color';

export interface ButtonStyles extends ViewStyle {
  fill?: boolean;
  borderColor: string;
  color: string;
  gradient: Gradient;
  shadowColor: string;
  text: TextStyle;
}

interface GetStylesOptions {
  darkMode?: boolean;
  intent?: ButtonIntent;
}

export interface Gradient {
  defaults: string[];
  pressed: string[];
}

export type ButtonIntent = 'primary' | 'danger' | 'none';

export interface ButtonProps extends PressableProps {
  intent?: ButtonIntent;
  width?: number;
  text?: string;
  loading?: boolean;
  shadow?: boolean;
}

const defaultColor = `#f5f8fa`;
const defaultDarkColor = `#21262d`;

const defaultLightStyle: ButtonStyles = {
  color: defaultColor,
  borderColor: colors.light.border,
  gradient: {
    defaults: gradientDarken(defaultColor),
    pressed: gradientDarken(darken(defaultColor, 30))
  },
  shadowColor: `#999`,
  text: {
    color: colors.light.text
  }
};

const defaultDarkStyle: ButtonStyles = {
  color: defaultDarkColor,
  borderColor: colors.dark.border,
  gradient: {
    defaults: gradientLighten(defaultDarkColor),
    pressed: gradientLighten(darken(defaultDarkColor, 30))
  },
  shadowColor: `#999`,
  text: {
    color: colors.dark.text
  }
};

const getStyles = ({ darkMode, intent = 'none' }: GetStylesOptions) => {
  const palette = {
    none: darkMode ? defaultDarkStyle : defaultLightStyle,
    primary: {
      color: colors.blue,
      borderColor: colors.blue,
      gradient: {
        defaults: gradientLighten(colors.blue),
        pressed: gradientLighten(darken(colors.blue, 30))
      },
      shadowColor: colors.blue,
      text: {
        color: colors.dark.text
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
        color: colors.dark.text
      }
    }
  };
  return palette[intent];
};

export function Button({
  intent = 'none',
  width,
  children,
  loading,
  disabled,
  shadow: showShadow,
  style,
  ...props
}: ButtonProps) {
  const darkMode = useColorScheme() === 'dark';

  const {
    color,
    gradient,
    borderColor,
    shadowColor,
    text: _textStyle
  } = getStyles({
    intent,
    darkMode
  });

  const isDisabled = disabled || loading;

  const pressable: PressableProps['style'] = props => {
    return StyleSheet.compose(
      {
        alignSelf: width ? 'auto' : 'stretch',
        width,
        ...(isDisabled ? { opacity: 0.5 } : {}),
        ...(props.pressed || isDisabled || !showShadow
          ? {}
          : shadow(8, { shadowColor }))
      },
      typeof style === 'function' ? style(props) : style
    );
  };

  const gradientColors = (pressed?: boolean) =>
    pressed ? gradient.pressed : gradient.defaults;

  const buttonStyles: ViewStyle = {
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: borderColor,
    paddingHorizontal: 15
  };

  const textStyle: TextStyle = { fontSize: 16, ..._textStyle };

  const content = loading ? (
    <ActivityIndicator color={textStyle.color} />
  ) : typeof children === 'string' ? (
    <Text style={textStyle}>{children}</Text>
  ) : (
    children
  );

  return (
    <Pressable {...props} style={pressable} disabled={isDisabled}>
      {({ pressed }) =>
        darkMode ? (
          <View
            style={[
              buttonStyles,
              { backgroundColor: pressed ? darken(color, 25) : color }
            ]}
          >
            {content}
          </View>
        ) : (
          <LinearGradient colors={gradientColors(pressed)} style={buttonStyles}>
            {content}
          </LinearGradient>
        )
      }
    </Pressable>
  );
}
