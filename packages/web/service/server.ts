import { NestFactory } from '@nestjs/core';
import { INestApplication, Type } from '@nestjs/common';
import {
  AppModule,
  fastifyAdapter,
  BookService,
  ChapterService,
  MongooseSerializerInterceptor
} from '@fullstack/server';

let instance: INestApplication | undefined;
let promise: Promise<INestApplication> | undefined;

export const serializer = new MongooseSerializerInterceptor({});

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

  return instance.get(type);
}

export async function getBookService() {
  return getServerInstance(BookService);
}

export async function getChpaterService() {
  return getServerInstance(ChapterService);
}

export async function closeInstance() {
  if (instance) {
    await instance.close();
  }
  instance = undefined;
  promise = undefined;
}
