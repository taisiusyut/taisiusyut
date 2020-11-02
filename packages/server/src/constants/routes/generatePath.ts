// https://github.com/ReactTraining/react-router/blob/master/packages/react-router/modules/generatePath.js
import { compile, PathFunction } from 'path-to-regexp';

const cache: Record<string, PathFunction> = {};
const cacheLimit = 10000;
let cacheCount = 0;

function compilePath(path: string) {
  if (cache[path]) return cache[path];

  const generator = compile(path);

  if (cacheCount < cacheLimit) {
    cache[path] = generator;
    cacheCount++;
  }

  return generator;
}

export function generatePath(path = '/', params: any = {}): string {
  return path === '/' ? path : compilePath(path)(params);
}
