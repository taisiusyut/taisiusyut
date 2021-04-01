import { ViewStyle } from 'react-native';

interface ShadowOffset {
  shadowOffsetX?: number;
  shadowOffsetY?: number;
}

// https://github.com/ethercreative/react-native-shadow-generator/blob/master/index.html

function parseShadow(raw: string) {
  const values = raw.split(' ').map(val => +val.replace('px', ''));
  return {
    x: values[0],
    y: values[1],
    blur: values[2],
    spread: values[3] // unused
  };
}

function interpolate(i: number, a: number, b: number, a2: number, b2: number) {
  return ((i - a) * (b2 - a2)) / (b - a) + a2;
}

const penumbra = [
  '0px 1px 1px 0px',
  '0px 2px 2px 0px',
  '0px 3px 4px 0px',
  '0px 4px 5px 0px',
  '0px 5px 8px 0px',
  '0px 6px 10px 0px',
  '0px 7px 10px 1px',
  '0px 8px 10px 1px',
  '0px 9px 12px 1px',
  '0px 10px 14px 1px',
  '0px 11px 15px 1px',
  '0px 12px 17px 2px',
  '0px 13px 19px 2px',
  '0px 14px 21px 2px',
  '0px 15px 22px 2px',
  '0px 16px 24px 2px',
  '0px 17px 26px 2px',
  '0px 18px 28px 2px',
  '0px 19px 29px 2px',
  '0px 20px 31px 3px',
  '0px 21px 33px 3px',
  '0px 22px 35px 3px',
  '0px 23px 36px 3px',
  '0px 24px 38px 3px'
];

export function shadow(
  depth: number,
  { shadowOffsetX, shadowOffsetY, ...styles }: ViewStyle & ShadowOffset = {}
): ViewStyle {
  const s = parseShadow(penumbra[depth]);
  const y = s.y === 1 ? 1 : Math.floor(s.y * 0.5);
  return {
    shadowColor: '#000',
    shadowOffset: {
      width: shadowOffsetX || 0,
      height: shadowOffsetY || y
    },
    shadowOpacity: Number(interpolate(depth, 1, 24, 0.2, 0.6).toFixed(2)),
    shadowRadius: Number(interpolate(s.blur, 1, 38, 1, 16).toFixed(2)), //(s.blur * 0.45).toFixed(2);
    elevation: depth + 1,
    ...styles
  };
}
