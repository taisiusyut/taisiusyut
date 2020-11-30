import { INestApplication } from '@nestjs/common';

declare module 'http' {
  interface ServerResponse {
    /**
     * @property {INestApplication} handled in `server.js`. Shoud be defined if `production`
     */
    app?: INestApplication;
  }
}
