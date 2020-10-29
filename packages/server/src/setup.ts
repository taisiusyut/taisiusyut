import { ValidationPipe } from '@nestjs/common';
import {
  FastifyAdapter,
  NestFastifyApplication
} from '@nestjs/platform-fastify';
import { FastifyServerOptions } from 'fastify';
import { MongooseExceptionFilter } from './utils/mongoose';
import helmet from 'fastify-helmet';
import rateLimit from 'fastify-rate-limit';
import compression from 'fastify-compress';
import cookieParser from 'fastify-cookie';
import qs from 'qs';

export type { NestFastifyApplication };

export const fastifyAdapter = () =>
  new FastifyAdapter({
    querystringParser: qs.parse as FastifyServerOptions['querystringParser']
  });

export function setupApp(app: NestFastifyApplication): void {
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(new MongooseExceptionFilter());

  app.register(compression, { encodings: ['gzip', 'deflate'] });
  app.register(cookieParser);
  app.register(helmet);

  if (process.env.NODE_ENV === 'production') {
    app.register(rateLimit, {
      max: 100,
      timeWindow: 5 * 60 * 1000
    });
  }
}
