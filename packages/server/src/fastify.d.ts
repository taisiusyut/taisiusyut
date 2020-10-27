// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as _fastify from 'fastify';

declare module 'fastify' {
  interface FastifyRequest {
    // eslint-disable-next-line
    user: any;
  }
}
