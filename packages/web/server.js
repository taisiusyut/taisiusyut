// @ts-check

const path = require('path');
const { default: next } = require('next');
const { NestFactory } = require('@nestjs/core');
const { AppModule, fastifyAdapter, setupApp } = require('@fullstack/server');

/**
 * @param {object} option
 * @param {number} option.port
 * @param {boolean} option.dev
 */
async function startServer({ dev, port }) {
  const nextApp = next({ dev, dir: path.join(__dirname, './') });
  const handle = nextApp.getRequestHandler();

  try {
    await nextApp.prepare();

    /** @type {import('@nestjs/platform-fastify').NestFastifyApplication} */
    const nest = await NestFactory.create(AppModule.init(), fastifyAdapter());

    setupApp(nest);

    nest.use(
      /**
       * @param {*} req
       * @param {*} res
       * @param {() => void} next
       */
      (req, res, next) => {
        if (req.url.startsWith('/api')) {
          next();
        } else {
          res.app = nest;
          return handle(req, res);
        }
      }
    );

    nest.setGlobalPrefix('api');

    await nest.init();
    await nest.getHttpAdapter().getInstance().ready();

    await nest.listen(port, '0.0.0.0');

    // eslint-disable-next-line
    console.log(`> Ready on localhost:${port} - env ${process.env.NODE_ENV}`);

    return () => {
      nest.close();
    };
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

startServer({
  dev: process.env.NODE_ENV !== 'production',
  port: Number(process.env.PORT) || 3000
});
