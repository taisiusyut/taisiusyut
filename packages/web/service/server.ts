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

export async function getServerInstance<T, R = T>(type: Type<T>): Promise<R> {
  if (!promise) {
    promise = createInstance();
  }

  if (!instance) {
    instance = await promise;
  }

  return instance.resolve(type);
}

export async function getBookService() {
  return getServerInstance(BookService);
}

export async function getBookController() {
  return getServerInstance(BookController);
}

export async function getChpaterService() {
  return getServerInstance(ChapterService);
}

export async function getChpaterController() {
  return getServerInstance(ChapterController);
}

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
