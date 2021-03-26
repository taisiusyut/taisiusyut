import { FastifyServerOptions } from 'fastify';
import {
  FastifyAdapter,
  NestFastifyApplication
} from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@/config';
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
  const configService = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      transformOptions: {
        // Since validation pipe cannot assign `group` option dynamically
        // We need to whitelist by default then filter out by `access.pipe`
        groups,
        exposeUnsetFields: false,
        excludePrefixes: ['$'] // for mongo operator
      }
    })
  );
  app.useGlobalFilters(new MongooseExceptionFilter());

  app.register(compression, { encodings: ['gzip', 'deflate'] });
  app.register(cookieParser, { secret: configService.get('COOKIE_SECRET') });
  app.register(helmet);

  if (process.env.NODE_ENV === 'production') {
    app.register(rateLimit, {
      max: 100,
      timeWindow: 5 * 60 * 1000
    });
  }
}
