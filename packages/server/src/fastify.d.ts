// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as _fastify from 'fastify';
import { JWTSignPayload } from '@/typings';

declare module 'fastify' {
  interface FastifyRequest {
    // eslint-disable-next-line
    user?: JWTSignPayload;
  }
}
