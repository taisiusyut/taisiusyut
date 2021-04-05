import { NestFactory } from '@nestjs/core';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { fastifyAdapter, setupApp } from './setup';

const PORT = Number(process.env.PORT) || 5000;

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule.init({ WEB_VERSION: 'development' }),
    fastifyAdapter()
  );

  setupApp(app);

  app.setGlobalPrefix('api');

  await app.listen(PORT, '0.0.0.0');
}
bootstrap();
