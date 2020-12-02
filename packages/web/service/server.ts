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
    app = defaultInstance;
  } else {
    if (!appPromise) {
      appPromise = createInstance();
    }

    if (!app) {
      try {
        app = await Promise.race([
          appPromise,
          new Promise(resolve => setTimeout(resolve, 3000)).then(() =>
            Promise.reject(`get instance time out`)
          )
        ]);
      } catch (error) {
        appPromise = undefined;
        return getServerInstance(type, defaultInstance);
      }
    }
  }

  return app.resolve(type);
}

const createGetter = <T, R = T>(payload: Type<T>) => async (
  defaultInstance?: INestApplication
) => {
  const result = await getServerInstance<T, R>(payload, defaultInstance);
  return result;
};

export const getBookService = createGetter(BookService);
export const getBookController = createGetter(BookController);
export const getChpaterService = createGetter(ChapterService);
export const getChpaterController = createGetter(ChapterController);

export const serializer = new MongooseSerializerInterceptor({});

type Payload = Parameters<typeof serializer.serialize>[0];
type TransformOptions = Parameters<typeof serializer.serialize>[1];
export function serialize<T>(payload: Payload, options?: TransformOptions) {
  return serializer.serialize(payload, {
    excludePrefixes: ['_'],
    ...options
  }) as T;
}
