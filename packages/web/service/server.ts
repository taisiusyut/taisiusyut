import { NestFactory } from '@nestjs/core';
import { INestApplication, Type } from '@nestjs/common';
import {
  AppModule,
  fastifyAdapter,
  BookService,
  BookController,
  ChapterService,
  ChapterController,
  MongooseSerializerInterceptor
} from '@fullstack/server';

let instance: INestApplication | undefined;
let promise: Promise<INestApplication> | undefined;

async function createInstance() {
  const instance = await NestFactory.create(
    AppModule.init(),
    fastifyAdapter(),
    { logger: false }
  );
  await instance.init();
  await instance.getHttpAdapter().getInstance().ready();
  return instance;
}

export async function getServerInstance<T, R = T>(
  type: Type<T>,
  defaultInstance?: INestApplication
): Promise<R> {
  if (defaultInstance) {
    instance = defaultInstance;
  } else {
    if (!promise) {
      promise = createInstance();
    }

    if (!instance) {
      instance = await promise;
    }
  }
  return instance.resolve(type);
}

const createGetter = <T, R = T>(payload: Type<T>) => (
  defaultInstance?: INestApplication
) => getServerInstance<T, R>(payload, defaultInstance);

export const getBookService = createGetter(BookService);
export const getBookController = createGetter(BookController);
export const getChpaterService = createGetter(ChapterService);
export const getChpaterController = createGetter(ChapterController);

export async function closeInstance() {
  if (instance) {
    await instance.close();
  }
  instance = undefined;
  promise = undefined;
}

export const serializer = new MongooseSerializerInterceptor({});

type Payload = Parameters<typeof serializer.serialize>[0];
type TransformOptions = Parameters<typeof serializer.serialize>[1];
export function serialize<T>(payload: Payload, options?: TransformOptions) {
  return serializer.serialize(payload, {
    excludePrefixes: ['_'],
    ...options
  }) as T;
}
