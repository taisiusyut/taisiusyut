import fs from 'fs';
import path from 'path';
import rimraf from 'rimraf';

const rootDir = path.resolve(process.cwd(), '.next/server/pages');

if (process.env.NODE_ENV === 'production' && !fs.existsSync(rootDir)) {
  throw new Error(`[NextJSCacheService] ${rootDir} not found`);
}

export class NextJSCacheService {
  async clear(pathname: string) {
    if (process.env.NODE_ENV === 'production') {
      const dest = path.resolve(rootDir, pathname);
      return new Promise<void>((resolve, reject) => {
        rimraf(dest, error => (error ? reject(error) : resolve()));
      });
    }
  }
}
