// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as _fastify from 'fastify';
import { JWTSignPayload } from '@/typings';

type MultipartHandler = (
  field: string,
  file: any,
  filename: string,
  encoding: string,
  mimetype: string
) => void;

interface BodyEntry {
  data: Buffer;
  filename: string;
  encoding: string;
  mimetype: string;
  limit: false;
}

declare module 'fastify' {
  interface FastifyRequest {
    // eslint-disable-next-line
    user?: JWTSignPayload;

    isMultipart: () => boolean;

    multipart: (
      handler: MultipartHandler,
      next: (err: Error) => void,
      options?: busboy.BusboyConfig
    ) => busboy.Busboy;
  }
}
