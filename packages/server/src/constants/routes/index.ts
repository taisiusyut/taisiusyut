import { Routes } from './routes';
import { generatePath } from './generatePath';

type UnionToIntersection<U> = (
  U extends any // eslint-disable-line
    ? (k: U) => void
    : never
) extends (k: infer I) => void
  ? I
  : never;

type Category = Exclude<keyof typeof Routes, 'base_url'>;
type AllKeys = keyof UnionToIntersection<typeof Routes[Category]>;

const category = Object.keys(Routes).slice(1) as Category[];
export const routes = {
  ...Routes,
  ...category.reduce((acc, key) => {
    const paths = Routes[key];
    const prefix = paths.prefix;
    for (const key in paths) {
      if (key !== 'prefix') {
        acc[key] = prefix + paths[key];
      }
    }
    return acc;
  }, {} as Record<AllKeys, string>)
};

declare global {
  interface String {
    generatePath(params?: Record<string, unknown>): string;
  }
}

// eslint-disable-next-line no-extend-native
String.prototype.generatePath = function (params: Record<string, unknown>) {
  return generatePath(this.toString(), params);
};
