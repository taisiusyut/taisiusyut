export type Color = typeof colors;
export type Theme = typeof lightTheme;

export const colors = {
  blue: '#4285f4',
  red: '#DB3737'
};

export const lightTheme = {
  ...colors,
  type: 'light',
  accent: colors.blue,
  primary: '#fff',
  secondary: '#f2f2f2',
  card: `#fff`,
  text: '#393939',
  textMuted: '#999',
  border: '#c8cbcd'
};

export const darkTheme: Theme = {
  ...colors,
  type: 'dark',
  accent: colors.blue,
  primary: '#121212',
  secondary: '#222',
  card: `#1f1f1f`,
  text: '#fff',
  textMuted: '#a09c97',
  border: `#444c56`
};
