export const colors = {
  blue: '#4285f4',
  red: '#DB3737',
  light: {
    primary: '#fff',
    secondary: '#f2f2f2',
    text: '#393939',
    textMuted: '#999',
    border: '#c8cbcd'
  },
  dark: {
    primary: '#161b22',
    secondary: '#0d1117',
    text: '#fff',
    textMuted: '#a09c97',
    border: `#3f444b`
  }
};

// https://stackoverflow.com/a/57401891/9633867
export function shadeColor(input: string, percent: number) {
  let color = '';
  if (input.startsWith('#')) {
    color = input.length === 4 ? input + input.slice(1) : input;
  } else if (input.startsWith('rgb')) {
    const matches = input.match(/\d{1,3}/g) || [];
    if (matches.length >= 3) {
      const [r, g, b] = matches.map(Number);
      color = rgbToHex(r, g, b);
    }
  }

  if (!color) {
    throw new Error(`invalid color input ${input}`);
  }

  return (
    '#' +
    color
      .replace(/^#/, '')
      .replace(/../g, color =>
        (
          '0' +
          Math.min(255, Math.max(0, parseInt(color, 16) + percent)).toString(16)
        ).substr(-2)
      )
  );
}

export const lighten = shadeColor;

export const darken = (input: string, percent: number) =>
  shadeColor(input, percent * -1);

export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

export const gradientLighten = (color: string) => [
  lighten(color, 40),
  lighten(color, 20),
  color
];

export const gradientDarken = (color: string) => [
  color,
  darken(color, 10),
  darken(color, 20),
  darken(color, 30),
  darken(color, 20)
];
