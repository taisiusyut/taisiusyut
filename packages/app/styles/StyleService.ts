import { Theme, darkTheme } from './theme';

export const StyleService = {
  theme: darkTheme,

  setTheme(theme: Theme) {
    this.theme = theme;
  },

  get(key: keyof Theme) {
    return this.theme[key];
  }
};
