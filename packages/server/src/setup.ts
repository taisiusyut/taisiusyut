import { FastifyServerOptions } from 'fastify';
import {
  FastifyAdapter,
  NestFastifyApplication
} from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';
import { UserRole } from '@/typings';
import { MongooseExceptionFilter } from '@/utils/mongoose';
import { allPermissions } from '@/utils/access';
import helmet from 'fastify-helmet';
import rateLimit from 'fastify-rate-limit';
import compression from 'fastify-compress';
import cookieParser from 'fastify-cookie';
import qs from 'querystring';

export type { NestFastifyApplication };

export const fastifyAdapter = () =>
  new FastifyAdapter({
    // https://github.com/fastify/fastify/blob/master/docs/Server.md#maxparamlength
    // increase `maxParamLength` for get book by name
    maxParamLength: 500,
    querystringParser: qs.parse as FastifyServerOptions['querystringParser']
  });

const groups = [...Object.values(UserRole), ...allPermissions];

export function setupApp(app: NestFastifyApplication): void {
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      // Since validation pipe cannot assign `group` option dynamically
      // We need to whitelist by default and filter out by `access.pipe`
      transformOptions: { groups } // for access.pipe.ts
    })
  );
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
