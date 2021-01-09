// @ts-check
/* eslint-disable no-undef */

const { NestFactory } = require('@nestjs/core');
const {
  AppModule,
  fastifyAdapter,
  BookService,
  BookController,
  ChapterService,
  ChapterController,
  AuthorController,
  MongooseSerializerInterceptor
} = require('@taisiusyut/server');

// eslint-disable-next-line no-console
const log = console.log.bind(console.log);

if (typeof global.app === 'undefined') {
  global.app = undefined;
}

if (typeof global.appPromise === 'undefined') {
  global.appPromise = undefined;
}

async function createInstance() {
  log(`wait  - start a new server instance`);

  const instance = await NestFactory.create(
    AppModule.init(),
    fastifyAdapter(),
    { logger: false }
  );
  await instance.init();
  await instance.getHttpAdapter().getInstance().ready();

  log(`event - new server instance ready`);

  return instance;
}

/**
 * @function
 * @template T
 * @template R = T
 * @param {import('@nestjs/common').Type<T>} type
 * @param {import('@nestjs/common').INestApplication} [defaultInstance]
 * @returns {Promise<R>}
 */
async function getServerInstance(type, defaultInstance) {
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
      }
    }
  }

  if (app) {
    return app.resolve(type);
  }

  return getServerInstance(type, defaultInstance);
}

/**
 * @function
 * @template T
 * @param {import('@nestjs/common').Type<T>} payload
 * @returns {(defaultInstance?: import('@nestjs/common').INestApplication) => Promise<T>}
 */
function createGetter(payload) {
  return async function getter(defaultInstance) {
    const result = await getServerInstance(payload, defaultInstance);
    return result;
  };
}

const getBookService = createGetter(BookService);
const getBookController = createGetter(BookController);
const getChpaterService = createGetter(ChapterService);
const getChpaterController = createGetter(ChapterController);
const getAuthorController = createGetter(AuthorController);

const _serializer = new MongooseSerializerInterceptor({});

/**
 * @function
 * @template T
 * @param {Parameters<typeof _serializer.serialize>[0]} payload
 * @param {Parameters<typeof _serializer.serialize>[1]} [options]
 * @returns {T}
 */
function serialize(payload, options) {
  /** @type {any} */
  const result = _serializer.serialize(payload, {
    excludePrefixes: ['_'],
    ...options
  });
  return result;
}

module.exports = {
  createInstance,
  getServerInstance,
  serialize,
  getBookService,
  getBookController,
  getChpaterService,
  getChpaterController,
  getAuthorController
};
